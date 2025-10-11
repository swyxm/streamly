# Streamly Documentation Index

## 📚 Documentation Overview

This directory contains comprehensive documentation for the Streamly live streaming platform. Each service and component is documented with setup instructions, API references, troubleshooting guides, and architectural information.

## 🚀 Quick Start

### Development Setup
- **[DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)** - Complete development environment setup guide

### Architecture Overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - High-level system architecture and data flow

## 🔧 Service Documentation

### Core Services

#### Backend Services
- **[USER_SERVICE.md](./USER_SERVICE.md)** - User authentication and profile management
- **[STREAM_SERVICE.md](./STREAM_SERVICE.md)** - Stream key generation and management
- **[CHAT_SERVICE.md](./CHAT_SERVICE.md)** - Real-time chat with WebSocket and Redis

#### Infrastructure Services
- **[RTMP_SERVER.md](./RTMP_SERVER.md)** - RTMP stream ingestion and HLS transcoding
- **[DATABASE.md](./DATABASE.md)** - PostgreSQL database setup and schema
- **[REDIS.md](./REDIS.md)** - Redis caching and pub/sub configuration

### Frontend
- **[FRONTEND.md](./FRONTEND.md)** - Next.js frontend application documentation

## 📋 Documentation Contents

| Service | Purpose | Technology | Port | Documentation |
|---------|---------|------------|------|---------------|
| **Frontend** | User interface | Next.js + React | 3000 | [View](./FRONTEND.md) |
| **User Service** | Authentication | Python + Flask | 8080 | [View](./USER_SERVICE.md) |
| **Stream Service** | Stream management | Python + Flask | 8082 | [View](./STREAM_SERVICE.md) |
| **RTMP Server** | Video streaming | Node.js + FFmpeg | 1935/8000 | [View](./RTMP_SERVER.md) |
| **Chat Service** | Real-time chat | Go + WebSocket | 8084 | [View](./CHAT_SERVICE.md) |
| **PostgreSQL** | Data storage | PostgreSQL 15 | 5432 | [View](./DATABASE.md) |
| **Redis** | Cache & pub/sub | Redis 7 | 6379 | [View](./REDIS.md) |

## 🏗️ Architecture Deep Dive

### System Architecture
```
Frontend (Next.js) ↔ User/Stream Services (Python/Flask)
                        ↓
RTMP Server (Node.js) ←→ Chat Service (Go/WebSocket)
                        ↓
                PostgreSQL + Redis
```

### Key Integration Points
- **Authentication**: Frontend ↔ User Service (JWT tokens)
- **Streaming**: Frontend ↔ Stream Service ↔ RTMP Server
- **Chat**: Frontend ↔ Chat Service ↔ Redis Pub/Sub
- **Data**: All services ↔ PostgreSQL

## 🔍 API Reference

### REST APIs
- **User Service**: `/api/auth/*` - Authentication endpoints
- **Stream Service**: `/api/streams/*` - Stream management

### Real-time APIs
- **Chat Service**: WebSocket `/ws` - Real-time messaging
- **RTMP Server**: RTMP `rtmp://host:1935/live/{key}` - Stream ingestion

### Stream URLs
- **RTMP Ingest**: `rtmp://localhost:1935/live/{stream_key}`
- **HLS Playback**: `http://localhost:8000/live/{stream_key}/index.m3u8`

## 🛠️ Development Commands

### Docker Commands
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up user-service

# Build all services
docker-compose build

# View logs
docker-compose logs -f chat-service

# Stop all services
docker-compose down
```

### Database Commands
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d streamly_users

# Redis CLI
docker-compose exec redis redis-cli

# Backup database
docker-compose exec postgres pg_dump -U postgres streamly_users > backup.sql
```

## 🚨 Troubleshooting

### Common Issues
1. **Docker Build Errors** - Check Dockerfile syntax and dependencies
2. **Service Connection Issues** - Verify network and environment variables
3. **Database Problems** - Check PostgreSQL logs and connection strings
4. **Stream Issues** - Validate RTMP server and FFmpeg configuration

### Debug Steps
1. Check service logs: `docker-compose logs service-name`
2. Verify environment variables in `.env` file
3. Test database connectivity: `docker-compose exec postgres psql -U postgres`
4. Check Redis status: `docker-compose exec redis redis-cli ping`

## 📖 Key Information

### Environment Variables
- **Database**: `DB_URL` - PostgreSQL connection string
- **JWT**: `SECRET_KEY` - Token signing secret (must be same across services)
- **Redis**: `REDIS_URL` - Redis connection URL
- **Ports**: Configurable via environment variables

### Security Notes
- JWT tokens expire after 1 hour
- Stream keys expire after 24 hours
- Passwords hashed with bcrypt
- CORS configured for frontend origins

### Performance Considerations
- Connection pooling for database
- Redis for caching and pub/sub
- HLS segment cleanup automation
- Multi-stage Docker builds for optimization

## 🔄 Update Information

This documentation is maintained alongside the codebase. Each service document includes:
- API endpoint documentation
- Configuration requirements
- Troubleshooting guides
- Performance considerations
- Future enhancement suggestions

For the most up-to-date information, refer to the individual service documentation files.

---

*Last Updated: October 2025*
*Documentation Coverage: All major services and infrastructure components*
