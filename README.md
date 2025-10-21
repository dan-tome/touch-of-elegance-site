# A Touch of Elegance - Professional Web Application

A fully functional web application for A Touch of Elegance dry cleaning services built with Node.js, Express, and modern web technologies.

## Features

- **Production-Ready Architecture**: Structured application with separation of concerns
- **RESTful API**: Complete API endpoints for services and contact management
- **Security**: Helmet.js for security headers, CORS support, input validation
- **Performance**: Compression middleware, optimized static file serving
- **Logging**: Comprehensive logging with different levels and file outputs
- **Health Checks**: Built-in health check endpoint for monitoring
- **Docker Support**: Containerized deployment with health checks
- **Kubernetes Ready**: Complete K8s manifests for GKE deployment
- **Error Handling**: Centralized error handling with graceful degradation
- **Graceful Shutdown**: Proper cleanup on application shutdown

## Project Structure

```
touch-of-elegance-site/
├── src/
│   ├── config/           # Configuration files
│   │   └── index.js      # Main configuration
│   ├── controllers/      # Request handlers
│   │   ├── servicesController.js
│   │   └── contactController.js
│   ├── middleware/       # Custom middleware
│   │   └── errorHandler.js
│   ├── routes/           # API routes
│   │   └── index.js
│   ├── utils/            # Utility functions
│   │   └── logger.js     # Logging utility
│   ├── index.js          # Application entry point
│   └── server.js         # Express server setup
├── public/               # Static files
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   ├── images/           # Images and media
│   └── index.html        # Main HTML file
├── logs/                 # Application logs (gitignored)
├── deployment.yml        # Kubernetes deployment
├── service.yml           # Kubernetes service
├── kustomization.yml     # Kustomize configuration
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore rules
├── .env.example          # Environment variables template
├── .eslintrc.js          # ESLint configuration
├── .gitignore            # Git ignore rules
├── package.json          # Node.js dependencies and scripts
└── README.md             # This file
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (optional, for containerization)
- kubectl (optional, for Kubernetes deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dan-tome/touch-of-elegance-site.git
   cd touch-of-elegance-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   NODE_ENV=development
   PORT=3000
   HOST=0.0.0.0
   LOG_LEVEL=info
   ```

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

Start the production server:

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Returns application health status

### API Information
- `GET /api` - Returns API information and available endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get a specific service by ID

### Contact
- `POST /api/contact` - Submit a contact form
  - Body: `{ name, email, phone, message }`

### Static Site
- `GET /` - Serves the main website

## Development

### Code Linting

Run ESLint to check code quality:

```bash
npm run lint
```

### Testing

The application includes a comprehensive test suite with 117 tests achieving >90% code coverage.

Run all tests with coverage:

```bash
npm test
```

Run tests in watch mode for development:

```bash
npm run test:watch
```

Run tests for CI/CD:

```bash
npm run test:ci
```

View detailed test documentation in `tests/README.md`.

**Test Coverage:**
- Statements: 96.72%
- Branches: 90.69%
- Functions: 94.73%
- Lines: 96.69%

## Docker Deployment

### Build Docker Image

```bash
docker build -t touch-of-elegance:latest .
```

### Run Docker Container

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  touch-of-elegance:latest
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## Kubernetes Deployment (GKE)

The application includes Kubernetes manifests for Google Kubernetes Engine (GKE) deployment.

### Prerequisites

1. Configure GKE cluster credentials
2. Update environment variables in `.github/workflows/google.yml`

### Deploy to Kubernetes

```bash
# Apply the configurations
kubectl apply -k .

# Check deployment status
kubectl get deployments
kubectl get services
kubectl get pods

# View logs
kubectl logs -f deployment/touch-of-elegance
```

### CI/CD Pipeline

The GitHub workflow (`.github/workflows/google.yml`) automatically:
1. Builds a Docker image
2. Pushes to Google Artifact Registry
3. Deploys to GKE cluster

Configure the following secrets in GitHub:
- `WORKLOAD_IDENTITY_PROVIDER`
- Update project-specific variables in the workflow file

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `HOST` | Server host | 0.0.0.0 |
| `CORS_ORIGIN` | Allowed CORS origins | * |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | info |
| `LOG_DIR` | Directory for log files | logs |

## Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Input Validation**: Request body validation
- **Error Handling**: Sanitized error messages in production
- **Rate Limiting**: Ready for rate limiting implementation
- **Non-root Docker User**: Container runs as non-privileged user

## Logging

The application uses a custom logger with:
- Console output with color coding (development)
- File-based logging (production)
- Different log levels (error, warn, info, debug)
- Automatic log rotation support

Logs are stored in the `logs/` directory:
- `error.log` - Error level logs
- `warn.log` - Warning level logs
- `info.log` - Info level logs
- `debug.log` - Debug level logs

## Performance Optimization

- Compression middleware for response compression
- Static file caching
- Efficient routing
- Health check endpoint for load balancers
- Graceful shutdown handling

## Monitoring and Health Checks

### Health Check Endpoint

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Docker Health Check

The Dockerfile includes a built-in health check that runs every 30 seconds.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change the PORT in your `.env` file:
```
PORT=8080
```

### Permission Errors

Ensure the `logs/` directory is writable:
```bash
chmod -R 755 logs/
```

### Docker Build Fails

Clear Docker cache and rebuild:
```bash
docker system prune -a
docker build --no-cache -t touch-of-elegance:latest .
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

This project is available for use by A Touch of Elegance.

## Support

For issues or questions, please contact the development team.