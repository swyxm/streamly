# RTMP Server Documentation

## Overview
The RTMP Server is a Node.js microservice responsible for ingesting live video streams via RTMP protocol and converting them to HLS (HTTP Live Streaming) format for web playback in the Streamly platform.

## Architecture & Technology Stack
- **Runtime**: Node.js
- **Streaming Engine**: node-media-server
- **Video Processing**: FFmpeg
- **Protocols**: RTMP (ingest), HLS (output)
- **Environment**: Docker container with Alpine Linux

## Core Functionality

### RTMP Stream Ingestion
- Accepts RTMP streams on port 1935
- Supports standard RTMP streaming from OBS, Streamlabs, etc.
- Validates stream keys against stream-service
- Manages stream lifecycle (start/stop)

### Video Transcoding
- Converts RTMP streams to HLS format in real-time
- Generates segmented video files (.ts) and playlists (.m3u8)
- Configurable segment duration and playlist size
- Automatic cleanup of old segments

### HTTP Server
- Serves HLS streams via HTTP on port 8000
- Provides access to live stream manifests and segments
- CORS enabled for web player access

## Configuration

### Node Media Server Configuration

#### RTMP Configuration
```javascript
{
  port: 1935,           // RTMP server port
  chunk_size: 60000,    // RTMP chunk size
  gop_cache: true,      // GOP cache enabled
  ping: 10,             // Ping interval (seconds)
  ping_timeout: 60      // Ping timeout (seconds)
}
```

#### HTTP Configuration
```javascript
{
  port: 8000,           // HTTP server port
  allow_origin: "*",    // CORS allowed origins
  mediaroot: "./media"  // Media files directory
}
```

#### Transcoding Configuration
```javascript
{
  ffmpeg: "./ffmpeg",   // FFmpeg binary path
  tasks: [
    {
      app: "live",      // RTMP application name
      hls: true,        // Enable HLS output
      hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
      hlsKeep: false    // Don't keep old segments
    }
  ],
  MediaRoot: "./media"  // Output directory
}
```

## Stream URLs

### RTMP Ingest URL Format
```
rtmp://localhost:1935/live/{stream_key}
```

### HLS Playback URL Format
```
http://localhost:8000/live/{stream_key}/index.m3u8
```

## Docker Configuration
- **Base Image**: Node.js 14 Alpine
- **Ports**: 1935 (RTMP), 8000 (HTTP)
- **Dependencies**: FFmpeg for video processing
- **Volumes**: Media storage for HLS files

## Development Setup

### Prerequisites
- Node.js 14+
- FFmpeg
- Docker (optional)

### Local Development
```bash
# Install dependencies
npm install

# Copy FFmpeg binary (if not in PATH)
cp $(which ffmpeg) ./ffmpeg

# Run RTMP server
node index.js
```

### Docker Development
```bash
# Build and run with docker-compose
docker-compose up rtmp-server
```

## Integration Points

### Stream Service Integration
- Queries stream-service to validate stream keys
- Makes HTTP requests to `/api/streams/{stream_key}` endpoint
- Requires stream-service to be running and accessible

### FFmpeg Integration
- Uses FFmpeg binary for video transcoding
- Converts RTMP to HLS format
- Handles multiple video codecs and formats

### File System Management
- Stores HLS segments in `./media` directory
- Automatically cleans up old segments
- Manages playlist files (.m3u8)

## Security Considerations

### Stream Key Validation
- Validates all incoming streams against stream-service
- Rejects streams with invalid or expired keys
- Prevents unauthorized stream ingestion

### CORS Configuration
- Allows all origins for HTTP stream serving
- Enables web players to access HLS streams
- No authentication required for stream playback

### Resource Management
- Automatic cleanup of old HLS segments
- Prevents disk space exhaustion
- Configurable segment retention

## Monitoring & Logging

### Stream Events
- Stream start/stop notifications
- Connection status monitoring
- Error logging for failed transcoding

### Performance Monitoring
- Stream bitrate monitoring
- Connection count tracking
- Disk usage monitoring

## Troubleshooting

### Common Issues

1. **FFmpeg Binary Not Found**
   - Ensure FFmpeg is installed and accessible
   - Check binary path in configuration
   - Verify FFmpeg version compatibility

2. **Stream Key Validation Fails**
   - Verify stream-service is running
   - Check stream key exists and is active
   - Ensure network connectivity to stream-service

3. **HLS Streams Not Accessible**
   - Check HTTP server is running on port 8000
   - Verify media directory exists and is writable
   - Check CORS configuration for web access

4. **RTMP Connection Rejected**
   - Verify RTMP server is running on port 1935
   - Check stream key is valid and not expired
   - Ensure OBS/encoder settings are correct

5. **Poor Stream Quality**
   - Adjust FFmpeg transcoding settings
   - Check input stream bitrate and resolution
   - Monitor system resources (CPU, memory)

## Performance Considerations

### Resource Usage
- High CPU usage during transcoding
- Memory usage scales with stream bitrate
- Disk I/O for HLS segment generation

### Scalability
- Single server handles multiple streams
- Horizontal scaling possible with load balancer
- CDN integration for global distribution

### Optimization Strategies
- GPU acceleration for transcoding (if available)
- Adaptive bitrate streaming
- CDN caching for HLS segments

## FFmpeg Configuration

### HLS Settings
- **Segment Time**: 2 seconds per segment
- **Playlist Size**: 3 segments in playlist
- **Cleanup**: Automatic deletion of old segments
- **Flags**: Standard HLS flags with segment deletion

### Supported Codecs
- H.264 video codec
- AAC audio codec
- Multiple bitrate support
- Hardware acceleration (if available)

## Future Enhancements

### Potential Improvements
- Multi-bitrate streaming support
- Stream recording and archiving
- Real-time transcoding quality adjustment
- GPU acceleration for better performance
- Stream analytics and metrics
- CDN integration for global streaming
- DVR functionality for live streams
- Chat overlay integration
- Stream thumbnails generation
