import os
import secrets
import psycopg2
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt as pyjwt
from functools import wraps

load_dotenv()

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'streaming_secret_key')
app.config['DB_URL'] = os.getenv('DB_URL')

def get_db_connection():
    return psycopg2.connect(app.config['DB_URL'])

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
            request.current_user = {
                'id': data['id'],
                'email': data.get('email')
            }
        except pyjwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except pyjwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated

@app.route('/health', methods=['GET'])
def health_check():
    try:
        conn = get_db_connection()
        conn.cursor().execute('SELECT 1')
        conn.close()
        return jsonify({
            "status": "healthy",
            "service": "stream-service",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "service": "stream-service",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@app.route('/api/streams/generate-key', methods=['POST'])
@token_required
def generate_stream_key():
    try:
        user_id = request.current_user['id']
        stream_key = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    SELECT id, stream_key, status, created_at
                    FROM streams
                    WHERE user_id = %s AND status = 'active'
                ''', (user_id,))

                existing_stream = cursor.fetchone()

                if existing_stream:
                    return jsonify({
                        'error': 'User already has an active stream',
                        'stream': {
                            'id': existing_stream[0],
                            'stream_key': existing_stream[1],
                            'status': existing_stream[2],
                            'rtmp_url': f'rtmp://localhost:1935/live/{existing_stream[1]}',
                            'hls_url': f'http://localhost:8083/hls/{existing_stream[1]}.m3u8'
                        }
                    }), 409
                cursor.execute('''
                    INSERT INTO streams (user_id, stream_key, status, expires_at)
                    VALUES (%s, %s, 'active', %s)
                    RETURNING id, stream_key, status, created_at
                ''', (user_id, stream_key, expires_at))

                result = cursor.fetchone()

                return jsonify({
                    'message': 'Stream key generated successfully',
                    'stream': {
                        'id': result[0],
                        'stream_key': result[1],
                        'status': result[2],
                        'rtmp_url': f'rtmp://localhost:1935/live/{result[1]}',
                        'hls_url': f'http://localhost:8083/hls/{result[1]}.m3u8',
                        'expires_at': expires_at.isoformat()
                    }
                }), 201

    except psycopg2.Error as e:
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/streams/stop', methods=['POST'])
@token_required
def stop_stream():
    try:
        user_id = request.current_user['id']

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    UPDATE streams
                    SET status = 'stopped', updated_at = NOW()
                    WHERE user_id = %s AND status = 'active'
                    RETURNING id, stream_key
                ''', (user_id,))

                result = cursor.fetchone()

                if not result:
                    return jsonify({"error": "No active stream found"}), 404

                return jsonify({
                    'message': 'Stream stopped successfully',
                    'stream_id': result[0],
                    'stream_key': result[1]
                }), 200

    except psycopg2.Error as e:
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/streams', methods=['GET'])
@token_required
def get_user_streams():
    try:
        user_id = request.current_user['id']

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    SELECT id, stream_key, status, created_at, updated_at, expires_at
                    FROM streams
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                ''', (user_id,))

                streams = cursor.fetchall()

                return jsonify({
                    'streams': [
                        {
                            'id': stream[0],
                            'stream_key': stream[1],
                            'status': stream[2],
                            'created_at': stream[3].isoformat() if stream[3] else None,
                            'updated_at': stream[4].isoformat() if stream[4] else None,
                            'expires_at': stream[5].isoformat() if stream[5] else None,
                            'rtmp_url': f'rtmp://localhost:1935/live/{stream[1]}',
                            'hls_url': f'http://localhost:8083/hls/{stream[1]}.m3u8'
                        }
                        for stream in streams
                    ]
                }), 200

    except psycopg2.Error as e:
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', '8082'))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
