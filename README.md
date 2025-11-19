# 📘 DeployHub Backend — Week 8 Challenge

A production-grade Node.js backend implementing:

- Express.js
- TypeScript
- Winston logging
- Prometheus metrics
- Health check endpoints
- Global error handling
- Unit testing (Jest + Supertest)
- Linting (ESLint + Prettier)
- Docker support
- Postman API documentation

---

## 🚀 Tech Stack

- Node.js + Express
- TypeScript
- Winston Logger
- Prometheus (prom-client)
- Jest + Supertest
- Docker
- Postman Collection
- ESLint + Prettier

---

## 📁 Project

```
src/ │
├── app.ts
├── server.ts
│
├── controllers/
│ └── healthController.ts
│ ├── middlewares/
│ ├── errorHandler.ts
│ ├── metricsMiddleware.ts
│ └── requestLogger.ts
│ ├── metrics/
│ └── metrics.ts
│ ├── routes/
│ ├── health.route.ts
│ └── metrics.route.ts
│ └── tests/
├── health.test.ts
├── metrics.test.ts
└── error.test.ts

```

---

## 🩺 Health Check Endpoint

**GET** `/api/health`

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "service": "deployhub-backend",
  "version": "1.0.0"
}
```

- Uses:

- Monitoring

- Deployment health checks

## 📊 Prometheus Metrics

**GET** `/api/metrics`

Exposes backend metrics in Prometheus format, including:

- CPU usage

- Memory usage

- Uptime

- HTTP request count

- Response time histogram

- Event loop lag

- Error rate

## 🪵 Logging (Winston)

Structured JSON logs:

- logs/app.log — standard logs

- logs/error.log — error logs

## 🧪 Testing

Run all tests:

Run tests with coverage:

```bash
npm run test -- --coverage
```

Coverage reports are generated in /coverage.

## 🐳 Docker Support

Build Docker image:

```bash
docker build -t deployhub-backend .

```

Run container:

```bash
docker run -p 3000:3000 deployhub-backend
```

Environment variables (.env):

PORT=3000
NODE_ENV=production

## 📬 Postman API Documentation

A ready-to-import Postman collection is included: postman/deployhub-backend.postman_collection.json

Includes:

- Health check

- Metrics endpoint

- Error endpoint

- Environment variables ({{BASE_URL}})

## 🌐 Deployment

Service URL [https://deployhub-backend-new.onrender.com]
Backend API To be added after deployment

- Health Check [https://deployhub-backend-new.onrender.com]/api/health
- Metrics [https://deployhub-backend-new.onrender.com]/api/metrics

## 🔄 CI/CD

GitHub Actions workflow will include:

- ESLint checks

- Prettier formatting

- Jest testing

- Build Docker image

Deploy to Render

## 📄 License

MIT License © 2025 DeployHub Backend
