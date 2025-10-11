# Frontend Documentation

## Overview
The Frontend is a Next.js React application that provides the user interface for the Streamly live streaming platform. It handles user authentication, stream management, live streaming, and real-time chat functionality.

## Architecture & Technology Stack
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Real-time Features**: WebSocket integration
- **Video Player**: HLS.js for live stream playback
- **Environment**: Docker container

## Core Features

### User Authentication
- Registration and login forms
- JWT token management
- Protected routes and components
- User profile display

### Stream Management
- Stream key generation interface
- Active stream monitoring
- Stream settings and configuration

### Live Streaming Interface
- RTMP stream configuration for OBS
- Live stream viewer with chat
- Stream controls and settings

### Real-time Chat
- WebSocket-based chat integration
- Room-based messaging
- Message history and real-time updates

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components
│   ├── stream/         # Streaming components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # API service functions
└── types/              # TypeScript type definitions
```

## API Integration

### Authentication Service
- Integration with user-service for login/registration
- JWT token storage and management
- Automatic token refresh (if needed)

### Stream Service Integration
- Stream key generation and management
- Stream status monitoring
- RTMP/HLS URL generation

### Chat Service Integration
- WebSocket connection management
- Real-time message handling
- Room-based chat organization

## Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_WS_URL`: WebSocket server URL
- `NEXT_PUBLIC_RTMP_URL`: RTMP server URL

### Package Dependencies
- **React/Next.js**: Core framework
- **Tailwind CSS**: Styling framework
- **HLS.js**: Video player for live streams
- **Socket.io-client**: WebSocket client (if needed)
- **Axios**: HTTP client for API calls

## Docker Configuration
- **Base Image**: Node.js (build stage)
- **Runtime**: Next.js production server
- **Port**: Frontend development port
- **Build**: Multi-stage build for optimization

## Development Setup

### Prerequisites
- Node.js 18+
- npm/yarn package manager
- Docker (optional)

### Local Development
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Docker Development
```bash
# Build and run with docker-compose
docker-compose up frontend
```

## Key Components

### Authentication Components
- `LoginForm`: User login interface
- `RegisterForm`: User registration interface
- `UserAccount`: User profile display
- `AuthContext`: Authentication state management

### Streaming Components
- `StreamGenerator`: Stream key generation interface
- `LiveStream`: Live stream viewer component
- `StreamControls`: Stream management controls
- `OBSConfig`: OBS configuration helper

### Chat Components
- `ChatRoom`: Main chat interface
- `MessageList`: Message history display
- `MessageInput`: Message composition
- `ChatContext`: Chat state management

## State Management

### Authentication Context
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

### Chat Context
```typescript
interface ChatContextType {
  messages: Message[];
  sendMessage: (message: string) => void;
  isConnected: boolean;
  currentRoom: string;
}
```

## Video Streaming Integration

### HLS Player Setup
- Uses HLS.js for cross-browser compatibility
- Automatic quality selection
- Error handling and reconnection

### RTMP Configuration
- OBS setup instructions
- Stream key management
- Server URL configuration

## Real-time Features

### WebSocket Integration
- Automatic connection management
- Reconnection on failure
- Message queuing for offline periods

### Live Updates
- Stream status updates
- Viewer count updates
- Chat message synchronization

## UI/UX Features

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly controls

### Dark/Light Theme
- Theme toggle functionality
- Persistent theme preferences
- System theme detection

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Bundle size optimization

### Image Optimization
- Next.js Image component
- Automatic image optimization
- Responsive image handling

### Caching Strategy
- API response caching
- Static asset optimization
- Service worker implementation (PWA ready)

## Testing

### Test Setup
- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing

### Test Coverage
- Component testing
- API integration testing
- WebSocket functionality testing

## Deployment

### Build Process
- TypeScript compilation
- Bundle optimization
- Static asset generation

### Production Deployment
- Docker container deployment
- CDN integration for static assets
- Environment-specific configuration

## Security Considerations

### Authentication Security
- Secure token storage
- Automatic token expiration
- Protected API routes

### Content Security
- Input sanitization
- XSS prevention
- CSRF protection

### Stream Security
- Stream key protection
- Secure WebSocket connections
- CORS configuration

## Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Load time monitoring
- Error tracking

### User Analytics
- Stream viewing analytics
- Chat engagement metrics
- User behavior tracking

## Troubleshooting

### Common Issues

1. **WebSocket Connection Fails**
   - Check chat-service is running
   - Verify WebSocket URL configuration
   - Check network/firewall settings

2. **Stream Playback Issues**
   - Verify HLS.js compatibility
   - Check stream URLs are accessible
   - Ensure RTMP server is streaming

3. **Authentication Problems**
   - Check user-service connectivity
   - Verify JWT token validity
   - Check CORS configuration

## Future Enhancements

### Potential Features
- Multi-language support
- Advanced stream analytics
- Stream recording and VOD
- Social features (following, followers)
- Stream scheduling
- Donations and monetization
- Mobile app development
- Advanced moderation tools
- Stream thumbnails and previews
