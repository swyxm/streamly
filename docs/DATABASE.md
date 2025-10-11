# Database Documentation

## Overview
PostgreSQL serves as the primary data persistence layer for the Streamly platform, storing user accounts, stream metadata, and application data.

## Architecture & Configuration

### PostgreSQL Setup
- **Version**: PostgreSQL 15 Alpine
- **Database Name**: streamly_users
- **Authentication**: PostgreSQL native authentication
- **Port**: 5432 (mapped to host)

### Database Schema

#### Users Table
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

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

#### Streams Table
```sql
CREATE TABLE streams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stream_key VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_streams_user_id ON streams(user_id);
CREATE INDEX idx_streams_stream_key ON streams(stream_key);
CREATE INDEX idx_streams_status ON streams(status);
CREATE INDEX idx_streams_expires_at ON streams(expires_at);
```

## Docker Configuration
- **Image**: postgres:15-alpine
- **Container Name**: streamly-postgres
- **Data Persistence**: Docker volume at `/var/lib/postgresql/data`
- **Health Check**: pg_isready connectivity test

## Environment Variables
- `POSTGRES_USER`: Database username (postgres)
- `POSTGRES_PASSWORD`: Database password (postgres)
- `POSTGRES_DB`: Database name (streamly_users)

## Development Setup

### Local PostgreSQL
```bash
# Run PostgreSQL locally
docker run --name streamly-postgres-local \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=streamly_users \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

### Database Initialization
The database is automatically initialized when the container starts. Tables are created by the application services on first run.

## Integration Points

### User Service Integration
- Primary user data storage
- Authentication and authorization data
- Connection pooling for performance

### Stream Service Integration
- Stream metadata and lifecycle management
- Stream key validation and lookup
- User-stream relationship management

## Performance Optimization

### Indexes
- Username and email indexes for fast lookups
- Stream key index for RTMP server validation
- Composite indexes for common query patterns

### Connection Management
- Both services use connection context managers
- Proper connection cleanup prevents leaks
- Parameterized queries prevent SQL injection

## Backup & Recovery

### Volume Persistence
- Database data persisted in Docker volume
- Survives container restarts and recreations
- External backup strategies recommended for production

### Backup Strategy
```bash
# Create database backup
docker exec streamly-postgres pg_dump \
  -U postgres streamly_users > backup.sql

# Restore database
docker exec -i streamly-postgres psql \
  -U postgres streamly_users < backup.sql
```

## Monitoring & Health Checks

### Health Check Configuration
- Test: `pg_isready -U postgres`
- Interval: 5 seconds
- Timeout: 5 seconds
- Retries: 5

### Monitoring Points
- Connection count and status
- Query performance metrics
- Disk space usage
- Replication lag (if applicable)

## Security Considerations

### Access Control
- Database user with limited privileges
- No external database access (internal network only)
- Password-based authentication

### Data Protection
- Passwords hashed with bcrypt
- No sensitive data logged
- SSL encryption for external connections (if needed)

## Troubleshooting

### Connection Issues
1. **Service cannot connect to database**
   - Verify PostgreSQL container is running
   - Check network connectivity
   - Validate connection string format

2. **Database refuses connections**
   - Check authentication credentials
   - Verify database user exists
   - Check PostgreSQL logs for errors

3. **Slow queries**
   - Analyze query execution plans
   - Check index usage
   - Monitor connection pool usage

## Maintenance

### Regular Tasks
- Monitor disk space usage
- Check for unused indexes
- Update statistics for query planner
- Review slow query logs

### Scaling Considerations
- Read replicas for heavy read workloads
- Connection pooling for high concurrency
- Partitioning for large tables (if needed)
