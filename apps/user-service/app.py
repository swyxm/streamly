import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
import jwt as pyjwt
import datetime
from functools import wraps

load_dotenv()

app = Flask(__name__)

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_jwt_secret_key_here')
app.config['DB_URL'] = os.getenv('DB_URL')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)

bcrypt = Bcrypt(app)

def get_db_connection():
    return psycopg2.connect(app.config['DB_URL'])

app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)

@app.route('/health', methods=['GET'])
def health_check():
    try:
        conn = get_db_connection()
        conn.cursor().execute('SELECT 1')
        conn.close()
        return jsonify({
            "status": "healthy",
            "service": "user-service",
            "timestamp": datetime.datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "service": "user-service",
            "timestamp": datetime.datetime.utcnow().isoformat()
        }), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"{field} is required"}), 400
        
        username = data["username"].strip()
        email = data["email"].strip().lower()
        password = data["password"]
        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()
        
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters long"}), 400
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    'SELECT id FROM users WHERE username = %s OR email = %s',
                    (username, email)
                )
                if cursor.fetchone() is not None:
                    return jsonify({"error": "Username or email already exists"}), 409
                
                register_query = '''
                    INSERT INTO users (username, email, password, first_name, last_name) 
                    VALUES (%s, %s, %s, %s, %s) 
                    RETURNING id, username, email, first_name, last_name
                '''
                cursor.execute(
                    register_query, 
                    (username, email, hashed_password, first_name, last_name)
                )
                result = cursor.fetchone()
                user_id = result[0]
                
                payload = {
                    "email": email,
                    "id": user_id,
                    "exp": datetime.datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
                }
                token = pyjwt.encode(payload, app.config['SECRET_KEY'], algorithm="HS256")
                
                return jsonify({
                    "message": "User registered successfully",
                    "userId": user_id,
                    "username": username,
                    "token": token,
                    "type": "Bearer"
                }), 201
                
    except psycopg2.Error as e:
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'password' not in data:
            return jsonify({"error": "Email/username and password are required"}), 400
            
        login_field = (data.get("username") or data.get("email")).strip().lower()
        password_guess = data["password"]
        
        if not login_field:
            return jsonify({"error": "Email or username is required"}), 400
        
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    SELECT id, username, email, password, first_name, last_name 
                    FROM users 
                    WHERE LOWER(email) = %s OR LOWER(username) = %s
                ''', (login_field, login_field))
                
                user = cursor.fetchone()
                
                if user and bcrypt.check_password_hash(user[3], password_guess):
                    payload = {
                        "email": user[2], 
                        "id": user[0], 
                        "exp": datetime.datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
                    }
                    token = pyjwt.encode(payload, app.config['SECRET_KEY'], algorithm="HS256")
                    
                    return jsonify({
                        "token": token,
                        "type": "Bearer",
                        "user": {
                            "id": user[0],
                            "username": user[1],
                            "email": user[2],
                            "firstName": user[4] or "",
                            "lastName": user[5] or ""
                        }
                    }), 200
                
                return jsonify({
                    "error": "Invalid email/username or password"
                }), 401
                
    except Exception as e:
        return jsonify({"error": "An error occurred during login"}), 500

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'error': 'Authentication token is missing'}), 401
        
        try:
            data = pyjwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['id']
            
            request.current_user = {
                'id': current_user_id,
                'email': data.get('email')
            }
            
        except pyjwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except pyjwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': 'Could not validate token'}), 401
            
        return f(*args, **kwargs)
    
    return decorated

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    try:
        user_id = request.current_user['id']
        
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    SELECT id, username, email, first_name, last_name, created_at 
                    FROM users WHERE id = %s
                ''', (user_id,))
                
                user = cursor.fetchone()
                
                if user:
                    return jsonify({
                        'id': user[0],
                        'username': user[1],
                        'email': user[2],
                        'firstName': user[3] or "",
                        'lastName': user[4] or "",
                        'createdAt': user[5].isoformat() if user[5] else None
                    }), 200
                
                return jsonify({'error': 'User not found'}), 404
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', '8080'))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)