# Redis Documentation

## Overview
Redis serves as the caching layer and real-time messaging backbone for the Streamly platform, providing high-performance data storage and pub/sub capabilities for chat functionality.

## Architecture & Configuration

### Redis Setup
- **Version**: Redis 7 Alpine
- **Port**: 6379 (default Redis port)
- **Persistence**: No persistence (in-memory cache)
- **Memory Policy**: Default eviction policy

## Core Functionality

### Chat Message Storage
- Stores chat messages in Redis lists
- Message expiration for automatic cleanup
- Message retrieval for chat history

### Pub/Sub Messaging
- Real-time message broadcasting
- Room-based message distribution
- WebSocket connection management

### Session Management
- User session storage (if implemented)
- Temporary data caching
- Rate limiting data (if implemented)

## Data Structures

### Message Storage
- **Key Format**: `messages:{room_id}`
- **Data Type**: Redis List (LPUSH/RPOP for FIFO)
- **Serialization**: JSON strings
- **Expiration**: 24 hours (configurable)

### Active Rooms
- **Key**: `rooms:active`
- **Data Type**: Redis Set
- **Purpose**: Track active chat rooms

### Connection Tracking
- **Key Format**: `connections:{room_id}`
- **Data Type**: Redis Set
- **Purpose**: Track WebSocket connections per room

## Docker Configuration
- **Image**: redis:7-alpine
- **Container Name**: streamly-redis
- **Port Mapping**: 6379:6379
- **Restart Policy**: unless-stopped
- **Network**: Internal Streamly network

## Development Setup

### Local Redis
```bash
# Run Redis locally
docker run --name streamly-redis-local \
  -p 6379:6379 \
  redis:7-alpine
```

### Redis Commands for Development
```bash
# Connect to Redis
redis-cli

# View active rooms
SMEMBERS rooms:active

# View messages in a room
LRANGE messages:room1 0 -1

# View connections in a room
SMEMBERS connections:room1

# Clear all data (development only)
FLUSHALL
```

## Integration Points

### Chat Service Integration
- Primary Redis client for chat functionality
- Message storage and retrieval
- Pub/sub for real-time messaging

### Future Integrations
- Session storage for user authentication
- Rate limiting counters
- Temporary data caching

## Configuration Options

### Memory Management
- **maxmemory**: Maximum memory usage
- **maxmemory-policy**: Eviction policy (default: noeviction)
- **tcp-keepalive**: TCP keepalive settings

### Performance Tuning
- **timeout**: Connection timeout
- **tcp-keepalive**: Keep connections alive
- ** databases**: Number of Redis databases

## Security Considerations

### Access Control
- Redis runs without authentication (development)
- Production should implement Redis AUTH
- Network isolation (internal only)

### Data Protection
- No sensitive data stored in Redis
- Messages are temporary and auto-expire
- No persistent personal data

## Monitoring & Health Checks

### Memory Usage
```bash
# Check memory usage
INFO memory

# Monitor keyspace
INFO keyspace
```

### Connection Monitoring
```bash
# Check active connections
INFO clients

# Monitor commands per second
INFO stats
```

## Performance Optimization

### Memory Efficiency
- JSON message serialization
- Automatic key expiration
- Efficient data structure usage

### Pub/Sub Performance
- Single Redis instance for pub/sub
- Connection pooling for multiple subscribers
- Message batching for high throughput

## Troubleshooting

### Connection Issues
1. **Chat service cannot connect**
   - Verify Redis container is running
   - Check network connectivity
   - Validate Redis URL configuration

2. **Messages not persisting**
   - Check Redis memory usage
   - Verify key expiration settings
   - Monitor Redis logs for errors

3. **Pub/sub not working**
   - Check Redis pub/sub functionality
   - Verify message format
   - Monitor subscriber connections

### Performance Issues
1. **High memory usage**
   - Monitor message accumulation
   - Check expiration settings
   - Consider memory policy adjustment

2. **Slow message retrieval**
   - Check Redis performance metrics
   - Monitor connection count
   - Consider Redis clustering for scale

## Scaling Considerations

### Horizontal Scaling
- Redis Cluster for multiple instances
- Read replicas for heavy read workloads
- Partitioning by room/chat channel

### Performance Scaling
- Connection pooling
- Pipeline operations for batch processing
- Lua scripting for complex operations

## Maintenance

### Data Cleanup
- Automatic expiration of old messages
- Manual cleanup of inactive rooms
- Memory defragmentation (if needed)

### Backup Strategy
- No persistent data storage (by design)
- Chat history is temporary
- No backup required for ephemeral data

## Future Enhancements

### Potential Improvements
- Redis Cluster for horizontal scaling
- Redis Streams for advanced messaging patterns
- Lua scripting for server-side processing
- Redisearch for message search functionality
- Rate limiting with Redis counters
- Session storage implementation
