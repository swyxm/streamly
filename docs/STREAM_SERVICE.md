# Stream Service Documentation

## Overview
The Stream Service is a Python Flask microservice responsible for managing live streaming functionality in the Streamly platform. It handles stream key generation, stream lifecycle management, and provides public stream discovery.

## Architecture & Technology Stack
- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **CORS**: Flask-CORS for cross-origin requests
- **Environment**: Docker container

## Core Functionality

### Stream Key Management
- Generates secure, unique stream keys for authenticated users
- Stream keys expire after 24 hours
- Prevents multiple active streams per user
- Supports stream lifecycle management (start/stop)

### Stream Discovery
- Provides public stream listings
- Allows lookup of streams by stream key
- Returns RTMP and HLS streaming URLs

### Integration with Streaming Infrastructure
- Works with RTMP server for stream ingestion
- Provides HLS URLs for video playback
- Manages stream metadata and status

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status and database connectivity.

### Generate Stream Key (Protected)
```
POST /api/streams/generate-key
Authorization: Bearer <jwt_token>
```
Creates a new stream key for the authenticated user. Returns stream information including RTMP and HLS URLs.

**Response:**
```json
{
  "stream": {
    "id": "integer",
    "stream_key": "string",
    "status": "active",
    "created_at": "ISO datetime",
    "expires_at": "ISO datetime",
    "rtmp_url": "rtmp://localhost:1935/live/{stream_key}",
    "hls_url": "http://localhost:8083/live/{stream_key}/index.m3u8"
  }
}
```

### Get User Streams (Protected)
```
GET /api/streams
Authorization: Bearer <jwt_token>
```
Returns all streams for the authenticated user with streaming URLs.

### Get Public Streams
```
GET /api/streams/public
```
Returns all active, non-expired public streams. No authentication required.

### Get Stream by Key
```
GET /api/streams/{stream_key}
```
Returns stream information for a specific stream key. Used by RTMP server for stream validation.

## Configuration

### Environment Variables
- `DB_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing secret key (must match user-service)
- `PORT`: Service port (default: 8082)
- `FLASK_DEBUG`: Enable debug mode

### Database Schema
```sql
CREATE TABLE streams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stream_key VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

## Docker Configuration
- **Base Image**: Python 3.11-slim
- **Port**: 8082
- **Dependencies**: PostgreSQL client
- **Health Check**: Database connectivity test

## Development Setup

### Prerequisites
- Python 3.11+
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
docker-compose up stream-service
```

## Integration Points

### Database Dependencies
- PostgreSQL service must be running and healthy
- Shares database with user-service
- Requires users table for user validation

### RTMP Server Integration
- Provides RTMP URLs in format: `rtmp://localhost:1935/live/{stream_key}`
- Provides HLS URLs in format: `http://localhost:8083/live/{stream_key}/index.m3u8`
- RTMP server queries this service to validate stream keys

### Authentication Integration
- Validates JWT tokens using same secret as user-service
- Requires valid user authentication for stream key generation
- Extracts user ID from JWT payload

## Security Considerations

### Stream Key Security
- Stream keys are cryptographically secure random strings
- Keys expire after 24 hours
- One active stream per user limit
- Keys are validated by RTMP server before stream ingestion

### CORS Configuration
- Allows requests from frontend origins
- Public streams endpoint allows all origins for stream discovery
- Supports credentials for authenticated requests

### Input Validation
- Stream key format validation
- User authentication validation
- Database query parameterization

## Monitoring & Logging

### Health Checks
- Database connectivity monitoring
- Service availability status
- Stream key validation

### Error Handling
- Database connection errors
- Invalid stream key requests
- Authentication failures
- Expired stream handling

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check DB_URL environment variable
   - Ensure database and tables exist

2. **JWT Token Validation Fails**
   - Ensure SECRET_KEY matches user-service
   - Verify user-service is running and accessible
   - Check token format and expiration

3. **Stream Key Generation Fails**
   - Verify user is authenticated
   - Check if user already has active stream
   - Ensure database is writable

4. **RTMP Server Cannot Find Stream**
   - Verify stream-service is running
   - Check stream key exists and is active
   - Ensure network connectivity between services

## Performance Considerations

### Database Optimization
- Uses connection context managers for proper cleanup
- Parameterized queries prevent SQL injection
- Efficient stream lookup by key

### Caching Strategy
- No internal caching (relies on database)
- Stream validation cached by RTMP server
- Redis could be added for stream metadata caching

## API Rate Limiting

### Current Limitations
- No rate limiting implemented
- Potential for abuse in stream key generation

### Recommended Enhancements
- Rate limiting on stream key generation
- Stream key regeneration cooldown
- Request logging for monitoring

## Future Enhancements

### Potential Improvements
- Stream metadata (title, description, tags)
- Stream thumbnails and previews
- Stream recording and VOD functionality
- Stream analytics and viewer counts
- Stream categories and search
- Scheduled streaming
- Multi-bitrate streaming support
- CDN integration for global streaming
