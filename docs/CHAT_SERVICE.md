# Chat Service Documentation

## Overview
The Chat Service is a Go microservice that provides real-time chat functionality for the Streamly platform using WebSocket connections and Redis for message storage and pub/sub capabilities.

## Architecture & Technology Stack
- **Language**: Go 1.21
- **Web Framework**: Gorilla WebSocket for real-time communication
- **Database/Cache**: Redis 7 for message storage and pub/sub
- **Protocol**: WebSocket for real-time messaging
- **Environment**: Docker container with Alpine Linux

## Core Functionality

### Real-time Messaging
- WebSocket server for bidirectional communication
- Room-based chat organization
- Message broadcasting to connected clients
- Connection lifecycle management

### Message Persistence
- Stores chat messages in Redis
- Message history retrieval
- Automatic message cleanup/expiration

### Redis Integration
- Uses Redis pub/sub for message distribution
- Message queuing for reliable delivery
- Connection state management

## API Endpoints

### WebSocket Connection
```
WS /ws?room={room_id}
```
Establishes WebSocket connection for real-time chat in specified room.

**Query Parameters:**
- `room`: Room identifier for chat grouping

### HTTP Endpoints
```
GET /health
```
Returns service health status and Redis connectivity.

## WebSocket Message Format

### Client to Server Messages
```json
{
  "type": "message",
  "data": {
    "room": "room_id",
    "message": "chat message text",
    "username": "sender_username"
  }
}
```

### Server to Client Messages
```json
{
  "type": "message",
  "data": {
    "id": "message_id",
    "room": "room_id",
    "message": "chat message text",
    "username": "sender_username",
    "timestamp": "ISO_datetime"
  }
}
```

## Redis Data Structure

### Message Storage
- **Key Format**: `messages:{room_id}`
- **Data Type**: Redis List
- **Serialization**: JSON

### Room Management
- **Active Rooms**: `rooms:active` (Redis Set)
- **Connection Tracking**: `connections:{room_id}` (Redis Set)

## Configuration

### Environment Variables
- `REDIS_URL`: Redis connection URL (default: redis:6379)
- `PORT`: Service port (default: 8084)

### Go Module Dependencies
```go
github.com/gorilla/websocket v1.5.0
github.com/redis/go-redis/v9 v9.0.5
github.com/google/uuid v1.3.0
```

## Docker Configuration
- **Base Image**: Golang 1.21 Alpine (build stage)
- **Runtime Image**: Alpine Linux
- **Port**: 8084
- **Dependencies**: Redis service

## Development Setup

### Prerequisites
- Go 1.21+
- Redis 7+
- Docker (optional)

### Local Development
```bash
# Install dependencies
go mod tidy

# Set environment variables
export REDIS_URL="redis://localhost:6379"
export PORT="8084"

# Run service
go run main.go
```

### Docker Development
```bash
# Build and run with docker-compose
docker-compose up chat-service
```

## Integration Points

### Redis Dependencies
- Redis service must be running and accessible
- Uses Redis for message storage and pub/sub
- Requires Redis connection for operation

### Frontend Integration
- WebSocket client connects to `/ws` endpoint
- Room-based message routing
- Real-time message delivery

### Authentication Integration
- Currently no authentication (public chat)
- Could be extended with JWT validation
- Room access control potential

## Security Considerations

### WebSocket Security
- No authentication currently implemented
- Room-based isolation for message routing
- Connection validation by room

### Message Validation
- Basic message format validation
- Room ID sanitization
- Message length limits (recommended)

### Redis Security
- Redis should be firewalled/internal only
- No external Redis access
- Connection encryption recommended

## Monitoring & Logging

### Connection Management
- WebSocket connection tracking
- Connection lifecycle logging
- Error handling for failed connections

### Message Metrics
- Message count per room
- Connection statistics
- Redis operation monitoring

### Health Checks
- Redis connectivity validation
- WebSocket server status
- Memory usage monitoring

## Troubleshooting

### Common Issues

1. **WebSocket Connection Fails**
   - Verify service is running on correct port
   - Check Redis connectivity
   - Validate room ID format

2. **Messages Not Delivered**
   - Check Redis pub/sub is working
   - Verify WebSocket connections are established
   - Check message format validity

3. **High Memory Usage**
   - Monitor Redis memory usage
   - Check for memory leaks in message storage
   - Implement message cleanup policies

4. **Connection Drops**
   - Check network connectivity
   - Monitor Redis connection stability
   - WebSocket ping/pong handling

## Performance Considerations

### WebSocket Scaling
- Single server handles multiple rooms
- Connection limit depends on system resources
- Horizontal scaling possible with Redis

### Redis Performance
- Message storage in Redis lists
- Pub/sub for real-time delivery
- Memory usage scales with message volume

### Optimization Strategies
- Message pagination for history
- Connection pooling for Redis
- Message compression for bandwidth

## Message Management

### Message Lifecycle
- Messages stored in Redis lists
- Automatic expiration (configurable)
- Retrieval limited for performance

### Room Management
- Dynamic room creation
- Connection tracking per room
- Automatic cleanup of inactive rooms

## Future Enhancements

### Potential Improvements
- User authentication and authorization
- Private rooms and moderation
- Message reactions and threading
- File/image sharing in chat
- Chat history pagination
- Message search functionality
- Typing indicators
- Read receipts
- Push notifications
- Chat bots and commands
- Message encryption
- Rate limiting and spam protection
