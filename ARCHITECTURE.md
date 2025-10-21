# Application Architecture Documentation

## Overview

This document describes the architecture and structure of the Touch of Elegance web application. The application has been transformed from a simple static website to a production-ready Node.js/Express application with modern best practices.

## Technology Stack

### Backend
- **Node.js** (v20+): JavaScript runtime
- **Express.js** (v4.21+): Web application framework
- **Helmet.js**: Security middleware
- **CORS**: Cross-Origin Resource Sharing support
- **Morgan**: HTTP request logger
- **Compression**: Response compression middleware
- **express-rate-limit**: Rate limiting middleware

### Development Tools
- **Nodemon**: Development server with hot reload
- **ESLint**: Code linting and quality checks

### Deployment
- **Docker**: Containerization
- **Kubernetes**: Container orchestration (GKE)

## Project Structure

```
touch-of-elegance-site/
├── src/                          # Application source code
│   ├── config/                   # Configuration files
│   │   └── index.js              # Main configuration
│   ├── controllers/              # Request handlers
│   │   ├── servicesController.js # Services business logic
│   │   └── contactController.js  # Contact form handler
│   ├── middleware/               # Custom middleware
│   │   ├── errorHandler.js       # Centralized error handling
│   │   └── rateLimiter.js        # Rate limiting configuration
│   ├── routes/                   # API route definitions
│   │   └── index.js              # Main router
│   ├── utils/                    # Utility functions
│   │   └── logger.js             # Custom logging utility
│   ├── index.js                  # Application entry point
│   └── server.js                 # Express server setup
├── public/                       # Static files served to clients
│   ├── css/                      # Stylesheets
│   │   └── styles.css
│   ├── js/                       # Client-side JavaScript
│   ├── images/                   # Image assets
│   └── index.html                # Main HTML file
├── logs/                         # Application logs (gitignored)
├── deployment.yml                # Kubernetes deployment manifest
├── service.yml                   # Kubernetes service manifest
├── kustomization.yml             # Kustomize configuration
├── Dockerfile                    # Docker build instructions
├── .dockerignore                 # Docker build exclusions
├── .env.example                  # Environment variables template
├── .gitignore                    # Git exclusions
├── eslint.config.js              # ESLint configuration
├── package.json                  # Node.js project manifest
└── package-lock.json             # Locked dependencies
```

## Architecture Layers

### 1. Entry Point (`src/index.js`)
- Loads environment variables
- Initializes the Express server
- Handles graceful shutdown
- Manages uncaught exceptions and unhandled rejections

### 2. Server Configuration (`src/server.js`)
- Express app initialization
- Middleware registration (order matters!)
- Static file serving
- Route mounting
- Error handling

### 3. Middleware Layer
#### Security Middleware
- **Helmet.js**: Sets security-related HTTP headers
- **CORS**: Configures cross-origin requests
- **Rate Limiting**: Prevents abuse and DDoS attacks

#### Utility Middleware
- **Morgan**: HTTP request logging
- **Compression**: Response compression for better performance
- **Body Parsers**: JSON and URL-encoded request parsing

### 4. Routing Layer (`src/routes/`)
- API endpoint definitions
- Route-specific middleware application
- Controller method binding

### 5. Controller Layer (`src/controllers/`)
- Business logic implementation
- Request validation
- Response formatting
- Error handling

### 6. Configuration Layer (`src/config/`)
- Environment-based configuration
- Centralized settings management
- Default values and validation

### 7. Utilities (`src/utils/`)
- Logging utility with multiple levels
- Reusable helper functions
- Cross-cutting concerns

### 8. Frontend Layer (`public/`)
- **Static HTML**: Main application page with semantic markup
- **CSS**: Responsive styles with mobile-first approach
- **JavaScript**: Client-side application logic
  - Dynamic content loading from API
  - Form handling and validation
  - User feedback with notifications
  - Smooth scrolling navigation

### 9. Testing Layer (`tests/`)
- **Unit Tests**: Controller and business logic tests
- **Integration Tests**: End-to-end API endpoint testing
- **Coverage Reports**: Code coverage analysis with Jest

## API Endpoints

### Health Check
```
GET /health
Response: {
  "status": "healthy",
  "timestamp": "2025-10-21T00:00:00.000Z",
  "uptime": 123.456
}
```

### API Information
```
GET /api
Response: {
  "message": "Touch of Elegance API",
  "version": "1.0.0",
  "endpoints": {
    "services": "/api/services",
    "contact": "/api/contact",
    "health": "/health"
  }
}
```

### Services Endpoints
```
GET /api/services
Rate Limit: 100 requests per 15 minutes per IP

GET /api/services/:id
Rate Limit: 100 requests per 15 minutes per IP
```

### Contact Endpoint
```
POST /api/contact
Rate Limit: 5 requests per hour per IP
Body: {
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (optional)",
  "message": "string (required)"
}
```

## Security Features

### 1. HTTP Security Headers (Helmet.js)
- Content Security Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- And more...

### 2. Rate Limiting
- General API rate limit: 100 requests per 15 minutes
- Contact form rate limit: 5 requests per hour
- Prevents abuse and DDoS attacks

### 3. Input Validation
- Email format validation (ReDoS-safe regex)
- Required field validation
- Request body sanitization

### 4. Error Handling
- Centralized error handling middleware
- Stack traces only in development
- Sanitized error messages in production

### 5. Docker Security
- Non-root user in container
- Health checks enabled
- Minimal attack surface (Alpine Linux)

## Logging System

### Log Levels
1. **error**: Critical errors that need immediate attention
2. **warn**: Warning messages for potential issues
3. **info**: General informational messages
4. **debug**: Detailed debugging information

### Log Output
- **Development**: Console with color coding
- **Production**: Console + file-based logging
- Separate log files by level (error.log, warn.log, etc.)

### Morgan Integration
- HTTP request logging
- Automatic log streaming to custom logger

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production) | development | No |
| `PORT` | Server port | 3000 | No |
| `HOST` | Server host | 0.0.0.0 | No |
| `CORS_ORIGIN` | Allowed CORS origins | * | No |
| `LOG_LEVEL` | Logging level | info | No |
| `LOG_DIR` | Log directory | logs | No |

## Docker Deployment

### Image Features
- Based on Node.js 20 Alpine (minimal size)
- Production dependencies only
- Non-root user execution
- Built-in health checks
- Graceful shutdown support

### Build Command
```bash
docker build -t touch-of-elegance:latest .
```

### Run Command
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  touch-of-elegance:latest
```

### Health Check
Docker automatically checks `/health` endpoint every 30 seconds.

## Kubernetes Deployment (GKE)

### Resources
1. **Deployment** (`deployment.yml`)
   - 2 replicas for high availability
   - Resource limits (CPU, Memory)
   - Liveness and readiness probes
   - Rolling update strategy

2. **Service** (`service.yml`)
   - LoadBalancer type
   - Exposes port 80 → 3000
   - Routes traffic to healthy pods

3. **Kustomization** (`kustomization.yml`)
   - Manages Kubernetes resources
   - Environment-specific overlays

### CI/CD Pipeline
GitHub Actions workflow (`.github/workflows/google.yml`):
1. Builds Docker image
2. Pushes to Google Artifact Registry
3. Deploys to GKE cluster
4. Verifies deployment

## Performance Optimizations

1. **Compression Middleware**: Gzip/Brotli compression
2. **Static File Caching**: Efficient asset serving
3. **Rate Limiting**: Prevents resource exhaustion
4. **Graceful Shutdown**: Completes requests before exit
5. **Health Checks**: Load balancer integration

## Development Workflow

### Local Development
1. `npm install` - Install dependencies
2. `cp .env.example .env` - Create environment file
3. `npm run dev` - Start development server with hot reload
4. `npm run lint` - Check code quality

### Production Build
1. `npm install --production` - Install production dependencies
2. `npm start` - Start production server

### Docker Development
1. `docker build -t touch-of-elegance .` - Build image
2. `docker run -p 3000:3000 touch-of-elegance` - Run container

## Error Handling Strategy

### Application Errors
- Caught by centralized error handler
- Logged with full context
- User-friendly messages returned

### Uncaught Exceptions
- Logged with stack trace
- Process exits gracefully
- Container orchestrator restarts

### Unhandled Rejections
- Logged with context
- Process exits gracefully
- Prevents memory leaks

## Monitoring and Observability

### Health Checks
- `/health` endpoint for load balancers
- Returns uptime and timestamp
- Used by Docker and Kubernetes

### Logging
- All requests logged via Morgan
- Error tracking with stack traces
- Structured log format

### Metrics (Future Enhancement)
- Response time tracking
- Error rate monitoring
- Request volume analytics

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- No local session storage
- Can run multiple instances

### Vertical Scaling
- Configurable resource limits
- Efficient memory usage
- Low CPU footprint

### Database Ready
- Controller layer prepared for DB integration
- Mock data structure in place
- Easy to add database connections

## Security Checklist

- [x] Security headers (Helmet.js)
- [x] Rate limiting on all endpoints
- [x] Input validation
- [x] ReDoS-safe regex patterns
- [x] Non-root Docker user
- [x] CORS configuration
- [x] Error message sanitization
- [x] Environment variable protection
- [x] No secrets in code
- [x] Secure dependencies (no vulnerabilities)

## Implemented Features

### Testing Infrastructure
- ✅ Unit tests with Jest (31 tests, 81.96% coverage)
- ✅ Integration tests for all API endpoints
- ✅ Controller unit tests
- ✅ Code coverage reporting

### Frontend Enhancements
- ✅ Dynamic service loading from API
- ✅ Interactive contact form with validation
- ✅ Client-side error handling
- ✅ Toast notifications for user feedback
- ✅ Smooth scrolling navigation
- ✅ XSS protection with HTML escaping

## Future Enhancements

### Short Term
1. Implement API versioning
2. Add request/response logging enhancement
3. Add metrics collection
4. Add more comprehensive error recovery

### Medium Term
1. Database integration (PostgreSQL/MongoDB)
2. Authentication and authorization (JWT)
3. Email service integration
4. File upload support
5. WebSocket support for real-time features

### Long Term
1. GraphQL API
2. Microservices architecture
3. Event-driven architecture
4. Caching layer (Redis)
5. CDN integration

## Maintenance

### Dependency Updates
```bash
npm audit          # Check for vulnerabilities
npm audit fix      # Fix vulnerabilities
npm update         # Update dependencies
npm outdated       # Check for outdated packages
```

### Log Rotation
Production logs should be rotated regularly:
- Use logrotate on Linux
- Or implement in-app log rotation
- Archive old logs to S3/GCS

### Backup Strategy
- Version control for code
- Database backups (when implemented)
- Configuration backups
- Log archives

## Troubleshooting

### Server Won't Start
1. Check port availability: `lsof -i :3000`
2. Verify environment variables
3. Check Node.js version: `node --version`
4. Review logs for errors

### High Memory Usage
1. Check for memory leaks
2. Review log file sizes
3. Monitor active connections
4. Analyze heap dump

### Performance Issues
1. Enable compression
2. Check rate limiting settings
3. Review database queries (when implemented)
4. Analyze request patterns

## Conclusion

This architecture provides a solid foundation for a production-ready web application with:
- Security best practices
- Scalability considerations
- Monitoring capabilities
- Easy deployment
- Maintainable codebase

The application is ready for further enhancements while maintaining stability and security.
