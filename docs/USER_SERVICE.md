# User Service Documentation

## Overview
The User Service is a Python Flask microservice responsible for user authentication, registration, and profile management in the Streamly platform.

## Architecture & Technology Stack
- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Flask-Bcrypt
- **CORS**: Flask-CORS for cross-origin requests
- **Environment**: Docker container

## Core Functionality

### User Registration
- Creates new user accounts with username, email, password
- Validates password strength (minimum 8 characters)
- Hashes passwords using bcrypt
- Prevents duplicate usernames/emails
- Returns JWT token upon successful registration

### User Authentication
- Supports login via email or username
- Validates credentials against stored hashed passwords
- Returns JWT token with user information upon successful login

### JWT Token Management
- Tokens expire after 1 hour (configurable)
- Tokens contain user ID and email
- Validates tokens on protected endpoints

### Protected Endpoints
- `/api/auth/me` - Get current user profile information

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status and database connectivity.

### User Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "first_name": "string (optional)",
  "last_name": "string (optional)"
}
```

### User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```
or
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

## Configuration

### Environment Variables
- `DB_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing secret key
- `PORT`: Service port (default: 8080)
- `FLASK_DEBUG`: Enable debug mode

### Database Schema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Docker Configuration
- **Base Image**: Python 3.10-slim
- **Port**: 8080
- **Dependencies**: PostgreSQL client
- **Health Check**: Database connectivity test

## Development Setup

### Prerequisites
- Python 3.10+
- PostgreSQL
- Docker (optional)

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DB_URL="postgresql://user:password@localhost:5432/streamly_users"
export SECRET_KEY="your_secret_key"

# Run service
python app.py
```

### Docker Development
```bash
# Build and run with docker-compose
docker-compose up user-service
```

## Integration Points

### Database Dependencies
- PostgreSQL service must be running and healthy
- Uses connection pooling for database operations

### CORS Configuration
- Allows requests from frontend (localhost:3000, localhost:3001)
- Supports credentials for authenticated requests

## Security Considerations

### Authentication Security
- Passwords are hashed using bcrypt
- JWT tokens are signed with secret key
- Tokens expire after 1 hour
- CORS restricts origins to trusted domains

### Input Validation
- Required fields validation
- Password length requirements
- SQL injection prevention via parameterized queries

## Monitoring & Logging

### Health Checks
- Database connectivity monitoring
- Service availability status

### Error Handling
- Database connection errors
- Invalid authentication attempts
- Malformed requests

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check DB_URL environment variable
   - Ensure database exists and user has permissions

2. **JWT Token Invalid**
   - Check SECRET_KEY matches between services
   - Verify token hasn't expired
   - Ensure token format is correct

3. **CORS Errors**
   - Verify frontend origin is in allowed list
   - Check request headers include proper Origin

4. **Registration/Login Fails**
   - Verify required fields are provided
   - Check password meets length requirements
   - Ensure unique username/email constraints

## Performance Considerations

### Database Optimization
- Uses connection context managers for proper cleanup
- Parameterized queries prevent SQL injection
- Minimal database round trips per request

### Caching Strategy
- No internal caching (stateless service)
- Relies on external Redis for session management

## Future Enhancements

### Potential Improvements
- Rate limiting for authentication endpoints
- Account lockout after failed attempts
- Password reset functionality
- Email verification for registration
- OAuth integration (Google, GitHub)
- User profile picture uploads
- Two-factor authentication
