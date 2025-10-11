# System Architecture Documentation

## Overview
Streamly is a comprehensive live streaming platform built with a microservices architecture. The platform enables users to broadcast live video streams, engage in real-time chat, and discover live content through a web-based interface.

## Architecture Overview

### Microservices Architecture
The platform consists of multiple independent services that communicate through well-defined APIs and message queues:

```
┌─────────────────────────────────────────────────────────────────┐
│                            Streamly Platform                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │   Frontend  │  │   User      │  │   Stream    │  │   Chat  │  │
│  │   (Next.js) │  │   Service   │  │   Service   │  │ Service │  │
│  │             │  │   (Python)  │  │   (Python)  │  │   (Go)  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘  │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │   RTMP      │  │   Postgres  │  │    Redis    │  │         │  │
│  │   Server    │  │   Database  │  │   Cache     │  │         │  │
│  │   (Node.js) │  │   (SQL)     │  │   (NoSQL)   │  │         │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Service Communication

### Synchronous Communication
- **HTTP/REST APIs**: Service-to-service communication
- **Direct database queries**: Services access shared PostgreSQL
- **WebSocket connections**: Real-time chat functionality

### Asynchronous Communication
- **Redis Pub/Sub**: Chat message distribution
- **Shared database**: Stream and user data consistency

## Data Flow Architecture

### User Registration Flow
1. User submits registration via Frontend
2. Frontend calls User Service API
3. User Service validates and stores user in PostgreSQL
4. User Service returns JWT token
5. Frontend stores token and updates UI

### Live Streaming Flow
1. Authenticated user requests stream key from Frontend
2. Frontend calls Stream Service API
3. Stream Service generates secure key and stores in PostgreSQL
4. Stream Service returns RTMP/HLS URLs
5. User configures OBS with RTMP URL and starts streaming
6. RTMP Server ingests stream and validates key with Stream Service
7. RTMP Server transcodes to HLS and serves via HTTP
8. Viewers access HLS streams via Frontend player

### Real-time Chat Flow
1. User connects to chat via Frontend WebSocket
2. Chat Service establishes WebSocket connection
3. Messages sent via WebSocket to Chat Service
4. Chat Service stores message in Redis and publishes to room
5. Redis pub/sub distributes message to all room subscribers
6. Chat Service broadcasts message to connected clients

## Technology Stack

### Frontend Layer
- **Next.js 14**: React framework with SSR/SSG
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **HLS.js**: Video player for live streams
- **WebSocket**: Real-time chat integration

### Backend Services Layer
- **Python Flask**: User and Stream services (REST APIs)
- **Go**: Chat service (WebSocket + Redis)
- **Node.js**: RTMP server (node-media-server)

### Data Layer
- **PostgreSQL 15**: Primary database (users, streams)
- **Redis 7**: Cache and pub/sub (chat messages)

### Infrastructure Layer
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Alpine Linux**: Lightweight container images

## Network Architecture

### Service Ports
- **Frontend**: Development port (3000)
- **User Service**: 8080
- **Stream Service**: 8082
- **RTMP Server**: 1935 (RTMP), 8000 (HTTP)
- **Chat Service**: 8084
- **PostgreSQL**: 5432
- **Redis**: 6379

### Network Configuration
- **Internal Network**: `streamly-network` (Docker bridge)
- **External Access**: Services exposed via Docker port mapping
- **Service Discovery**: Direct IP/port connections

## Deployment Architecture

### Development Deployment
- **Local Docker Compose**: Single-host development
- **Hot Reload**: Volume mounting for code changes
- **Database Persistence**: Named Docker volumes

### Production Considerations
- **Load Balancing**: Reverse proxy for frontend/API
- **Database Scaling**: Read replicas, connection pooling
- **Redis Clustering**: Horizontal scaling for chat
- **CDN Integration**: Global content distribution

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt for password security
- **CORS**: Cross-origin request handling

### Network Security
- **Internal Networking**: Services communicate via internal network
- **No External Database**: Database not exposed externally
- **Stream Key Validation**: Secure key-based stream access

### Data Protection
- **Input Validation**: SQL injection prevention
- **Secure Headers**: Security headers implementation
- **Rate Limiting**: API abuse prevention (planned)

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: Easy horizontal scaling
- **Database Scaling**: Read replicas for heavy workloads
- **Redis Clustering**: Chat service scalability

### Performance Optimization
- **Connection Pooling**: Database connection reuse
- **Caching Strategy**: Redis for session/user data
- **CDN Integration**: Static asset acceleration

## Monitoring & Observability

### Health Checks
- **Service Health**: `/health` endpoints on all services
- **Database Connectivity**: PostgreSQL connection tests
- **Redis Connectivity**: Cache connection validation

### Logging Strategy
- **Structured Logging**: JSON format for log aggregation
- **Error Tracking**: Centralized error collection
- **Performance Metrics**: Response times, throughput

## Development Workflow

### Local Development
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up user-service

# View logs
docker-compose logs -f chat-service

# Rebuild after code changes
docker-compose build stream-service
```

### Database Migrations
- **Schema Management**: Manual schema updates
- **Data Seeding**: Development data initialization
- **Migration Scripts**: Version control for schema changes

## API Documentation

### Service APIs
- **User Service**: `/api/auth/*` - Authentication endpoints
- **Stream Service**: `/api/streams/*` - Stream management
- **Chat Service**: WebSocket `/ws` - Real-time messaging

### Integration APIs
- **RTMP Server**: Validates streams with Stream Service
- **Frontend**: Consumes all service APIs
- **Chat Service**: Uses Redis pub/sub for messaging

## Error Handling Strategy

### Service Errors
- **Graceful Degradation**: Services continue if dependencies fail
- **Circuit Breakers**: Prevent cascade failures (planned)
- **Retry Logic**: Transient failure handling

### User Experience
- **Error Boundaries**: React error boundaries in frontend
- **User Feedback**: Clear error messages
- **Fallback UI**: Alternative content on failures

## Future Enhancements

### Planned Features
- **Multi-bitrate Streaming**: Adaptive bitrate for different connections
- **Stream Recording**: VOD functionality
- **Advanced Chat**: Emojis, file sharing, moderation
- **User Profiles**: Extended user information and social features
- **Analytics**: Stream metrics and viewer analytics

### Technical Improvements
- **Service Mesh**: Istio/Linkerd for service communication
- **Message Queue**: RabbitMQ/Kafka for event-driven architecture
- **API Gateway**: Centralized API management
- **Monitoring Stack**: Prometheus/Grafana for observability

## Troubleshooting Guide

### Common Issues
1. **Docker Build Failures**: Check Dockerfile syntax and dependencies
2. **Service Connection Issues**: Verify network and port configurations
3. **Database Problems**: Check PostgreSQL logs and connection strings
4. **Stream Issues**: Validate RTMP server and FFmpeg configuration

### Debug Commands
```bash
# Check service logs
docker-compose logs service-name

# Access service container
docker-compose exec service-name /bin/sh

# Check database connectivity
docker-compose exec postgres psql -U postgres -d streamly_users

# Monitor Redis
docker-compose exec redis redis-cli
```

This architecture provides a solid foundation for a scalable live streaming platform with room for growth and enhancement.
