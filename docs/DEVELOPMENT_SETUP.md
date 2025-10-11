# Development Setup Guide

## Project Structure

```
streamly/
├── apps/
│   ├── frontend/           # Next.js frontend application
│   │   ├── src/
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── contexts/   # React context providers
│   │   │   └── lib/        # API clients and utilities
│   │   └── ...
│   └── user-service/       # Python Flask user service
│       ├── app.py          # Main application
│       ├── init-db.py      # Database initialization
│       └── requirements.txt
├── docker-compose.yml      # Local development setup
└── docs/                   # Project documentation
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.10+ (for backend development)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/twitch-clone.git
   cd twitch-clone
   ```

2. **Start the development environment**
   ```bash
   # Build and start all services
   docker compose up -d --build
   
   # Initialize the database
   docker compose exec user-service python init-db.py
   ```

3. **Access the services**
   - Frontend: http://localhost:3000
   - User Service API: http://localhost:8080
   - PostgreSQL: localhost:5432

## Authentication System

### API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get JWT token
- `GET /api/auth/me` - Get current user profile (requires authentication)

### Example Requests

**Register a new user:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Get current user (authenticated):**
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development Workflow

### Frontend Development

```bash
cd apps/frontend
npm install
npm run dev
```

### Backend Development

```bash
# Install Python dependencies
cd apps/user-service
pip install -r requirements.txt

# Run the development server
python app.py
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# User Service
DB_URL=postgresql://postgres:postgres@postgres:5432/streamly_users
SECRET_KEY=your-secret-key-here
```

## Troubleshooting

1. **Database connection issues**
   ```bash
   # Check if PostgreSQL is running
   docker ps | grep postgres
   
   # Test database connection
   docker compose exec postgres psql -U postgres -c "\l"
   ```

2. **View service logs**
   ```bash
   # View all logs
   docker compose logs -f
   
   # View specific service logs
   docker compose logs -f user-service
   ```

3. **Reset the database**
   ```bash
   # Stop and remove containers
   docker compose down -v
   
   # Start fresh
   docker compose up -d --build
   docker compose exec user-service python init-db.py
   ```

## Testing

```bash
# Run frontend tests
cd apps/frontend
npm test

# Run backend tests
cd apps/user-service
pytest
```
