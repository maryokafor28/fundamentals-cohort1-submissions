# 🚀 DeployHub Backend

Production-ready Node.js backend with observability, CI/CD, and monitoring.

## 🌐 Deployed URL

**Production:** https://deployhub-backend-xxxx.onrender.com

## ✨ Features

- Health Checks & Readiness Probes
- Prometheus Metrics Collection
- Structured Logging (Pino)
- Error Tracking & Handling
- Docker Support
- Automated CI/CD Pipeline

## 🛠️ Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Logging:** Pino
- **Metrics:** Prometheus (prom-client)
- **Testing:** Jest + Supertest
- **CI/CD:** GitHub Actions
- **Deployment:** Render
- **Container:** Docker

## 📡 API Endpoints

### Health & Monitoring

- `GET /api/health` - System health check with metrics
- `GET /api/ready` - Readiness probe
- `GET /api/live` - Liveness probe
- `GET /api/metrics` - Prometheus metrics

### Service Info

- `GET /api/status` - Service status and version
- `GET /api/info` - API documentation

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Lint code
npm run lint
```

## 🐳 Docker

```bash
# Build
docker build -t deployhub-backend .

# Run
docker run -p 3001:3001 deployhub-backend
```

## 🌍 Environment Variables

```env
PORT=3001
NODE_ENV=production
LOG_LEVEL=info
FRONTEND_URL=https://your-frontend.vercel.app
```

## 📊 Observability

### Metrics Tracked

- HTTP request duration
- Total requests
- Active connections
- System resources (CPU, memory)
- Error counts

### Logging

All requests/responses logged in structured JSON format:

```json
{
  "level": "INFO",
  "type": "request",
  "method": "GET",
  "url": "/api/health",
  "statusCode": 200,
  "duration": "0.023s"
}
```

## 🧪 Testing

- Unit tests for all routes
- Integration tests for API endpoints
- Coverage: >80%

## 🔄 CI/CD Pipeline

GitHub Actions workflow:

1. **Test:** Lint + Run tests + Coverage
2. **Build:** Docker image build & test
3. **Deploy:** Automatic deployment to Render

## 👤 Author

John Kolawole - [GitHub](https://github.com/YOUR_USERNAME)

## 📝 License

MIT
