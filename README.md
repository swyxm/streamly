# Streamly

A full-stack, scalable live streaming platform inspired by Twitch, built with modern technologies and microservices architecture.

## Features

- 🎥 Live video streaming with RTMP/HLS
- 💬 Real-time chat with WebSockets
- 👤 User authentication and profiles
- 🔔 Real-time notifications
- 📺 Video on Demand (VOD)
- 🎨 Responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Video.js
- React Query

### Backend (Microservices)
- **API Gateway**: Spring Cloud Gateway
- **User Service**: Spring Boot, JWT
- **Stream Service**: Go
- **Chat Service**: Node.js + WebSockets
- **Follow Service**: Flask

### Infrastructure
- Docker & Docker Compose
- PostgreSQL
- Redis
- NGINX + RTMP Module
- FFmpeg
- AWS S3 (for VOD storage)

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Java 17+
- Go 1.21+
- Python 3.9+

### Local Development

1. Clone the repository
2. Start the development environment:
   ```bash
   docker-compose up -d
   ```
3. Access the applications:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080
   - Monitoring: http://localhost:3001 (Grafana)

## Project Structure

```
streamly/
├── apps/
│   ├── frontend/         # Next.js frontend
│   ├── api-gateway/      # Spring Cloud Gateway
│   ├── user-service/     # User authentication service
│   ├── stream-service/   # Stream management service
│   ├── chat-service/     # Real-time chat service
│   └── follow-service/   # Follow/notification service
├── infrastructure/
│   ├── nginx/            # NGINX configs
│   ├── docker/           # Docker configurations
│   └── k8s/              # Kubernetes manifests
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

## Development

### Code Style

- TypeScript/JavaScript: ESLint + Prettier
- Java: Google Java Format
- Python: Black + isort
- Go: gofmt

### Testing

```bash
# Run all tests
./scripts/run-tests.sh

# Run specific service tests
cd apps/frontend && npm test
```

## Deployment

### Production

```bash
# Build and deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to Kubernetes
kubectl apply -f infrastructure/k8s/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Streamly - Live Streaming Platform

A modern, full-stack live streaming platform built with React, Flask, and PostgreSQL. Features real-time streaming, user authentication, and a beautiful web interface.

## 🚀 Features

- **Live Streaming**: RTMP ingest with HLS delivery
- **User Authentication**: Secure login/signup system
- **Stream Management**: Create and manage stream keys
- **Real-time Streaming**: Low-latency video streaming
- **Modern UI**: Beautiful React-based interface
- **Docker Support**: Easy deployment with Docker Compose

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Flask (Python), PostgreSQL
- **Streaming**: Node Media Server (RTMP) + NGINX RTMP (HLS)
- **Deployment**: Docker, Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
cd /Users/swayam/CodingProjects/streamly
git clone <repository-url>
```

2. **Start all services**
```bash
npm run docker:up
# or
make docker-up
```

3. **Access the application**
- Frontend: http://localhost:3001
- API: http://localhost:8080 (users), http://localhost:8082 (streams)
- RTMP Streaming (OBS): rtmp://localhost:1935/live/YOUR_STREAM_KEY
- HLS Streaming (Viewers): http://localhost:8084/hls/YOUR_STREAM_KEY.m3u8

### OBS Studio Configuration

To stream to Streamly:

1. Open OBS Studio
2. Go to **Settings** → **Stream**
3. Set **Service** to `Custom`
4. Set **Server** to `rtmp://localhost:1935/live`
5. Set **Stream Key** to your stream key from the web interface
6. Click **Start Streaming**

## 📁 Project Structure

```
streamly/
├── apps/
│   ├── frontend/          # React frontend
│   ├── user-service/      # Flask user management API
│   └── stream-service/    # Flask streaming API
├── infrastructure/        # Deployment configurations
│   ├── docker/           # Docker files
│   ├── k8s/              # Kubernetes manifests
│   └── nginx/            # Nginx configurations
├── docs/                  # Documentation
└── README.md
```

## 🔧 Development

### Running Services Individually

```bash
# Frontend
cd apps/frontend && npm run dev

# User Service
cd apps/user-service && python app.py

# Stream Service
cd apps/stream-service && python app.py

# Streaming Server (Node Media Server)
docker run -d --name rtmp-server --network streamly_streamly-network \
  -p 1935:1935 -p 8083:8000 -v hls_data:/hls \
  illuspas/node-media-server:latest
```

### Database Setup

The PostgreSQL database is automatically set up with the required tables when services start.

## 🌐 API Endpoints

### User Service (`:8080`)
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /users/me` - Get current user info

### Stream Service (`:8082`)
- `GET /streams` - Get user's streams
- `POST /streams` - Create new stream
- `DELETE /streams/{id}` - Delete stream

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/streamly_users

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Flask
FLASK_DEBUG=false
```

## 🚀 Deployment

### Production Deployment

The `infrastructure/` directory contains production-ready configurations:

- **Docker**: Production Docker Compose setup
- **Kubernetes**: K8s deployment manifests
- **Nginx**: Reverse proxy configurations

### Scaling

For high-traffic deployments:

1. Use a load balancer for multiple streaming servers
2. Implement Redis for session management
3. Use a CDN for HLS delivery
4. Consider WebRTC for ultra-low latency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**OBS Connection Failed**
- Ensure Docker containers are running: `docker ps`
- Check RTMP server logs: `docker logs rtmp-server`
- Verify OBS configuration matches your stream key

**Platform Compatibility (Apple Silicon)**
- Node Media Server works better than nginx-rtmp on ARM64
- Use the provided Docker configuration for best compatibility

**HLS Playback Issues**
- Check if HLS files are being generated: `docker exec rtmp-server ls -la /hls/`
- Verify HTTP server is accessible: `curl http://localhost:8083/live/YOUR_KEY.m3u8`

### Logs

Check service logs:
```bash
# All services
docker-compose logs

# Specific service
docker logs streamly-rtmp-server
docker logs streamly-user-service
docker logs streamly-stream-service
```

## 🎯 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   OBS Studio    │───▶│ Node Media Server │───▶│   HLS Viewer    │
│                 │    │   (RTMP/HLS)    │    │   (Browser)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Stream Service │    │   User Service  │    │    Frontend     │
│   (Flask API)   │    │   (Flask API)   │    │    (React)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       └─────────────────┘