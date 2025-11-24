# FlowServe Backend API

A scalable and reliable REST API for real-time transaction processing and digital wallet operations.

## 🚀 Features

- **User Management**: Complete CRUD operations for user accounts
- **Transaction Processing**: Simulate and manage financial transactions
- **Rate Limiting**: Protection against API abuse
- **Request Validation**: Input validation using Zod
- **Error Handling**: Comprehensive error handling middleware
- **Logging**: Structured logging with Winston
- **API Documentation**: Complete Postman collection included

## 🛠️ Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Logging**: Winston
- **Rate Limiting**: express-rate-limit

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd flowserve-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flowserve?schema=public"

# API
API_VERSION=v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

4. **Database Setup**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npm run seed
```

5. **Start the server**

```bash
# Development
npm run dev

# Production
npm start
```

## 📁 Project Structure

```
flowserve-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── logger.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── transactionRoutes.js
│   ├── services/
│   │   ├── userService.js
│   │   └── transactionService.js
│   ├── validations/
│   │   ├── userValidation.js
│   │   └── transactionValidation.js
│   ├── utils/
│   │   └── response.js
│   └── app.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Users

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/api/v1/users`     | Get all users (paginated) |
| GET    | `/api/v1/users/:id` | Get user by ID            |
| POST   | `/api/v1/users`     | Create new user           |
| PUT    | `/api/v1/users/:id` | Update user               |
| DELETE | `/api/v1/users/:id` | Delete user               |

### Transactions

| Method | Endpoint                            | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| GET    | `/api/v1/transactions`              | Get all transactions (paginated) |
| GET    | `/api/v1/transactions/:id`          | Get transaction by ID            |
| POST   | `/api/v1/transactions`              | Create new transaction           |
| GET    | `/api/v1/transactions/user/:userId` | Get user transactions            |

### Health Check

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health status |

## 📝 API Usage Examples

### Create User

```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "walletBalance": 1000.00
  }'
```

### Get Users (Paginated)

```bash
curl "http://localhost:5000/api/v1/users?page=1&limit=10"
```

### Create Transaction

```bash
curl -X POST http://localhost:5000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "amount": 50.00,
    "type": "debit",
    "description": "Payment for service"
  }'
```

## 🔒 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 📊 Logging

Logs are written to:

- Console (development)
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs

Log levels: error, warn, info, http, debug

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📚 Postman Documentation

Import the Postman collection from `postman/FlowServe-API.postman_collection.json`

## 🚀 Deployment

### Using Render

1. Create new Web Service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Using Railway

```bash
railway login
railway init
railway add
railway up
```

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔐 Security Best Practices

- Input validation on all endpoints
- Rate limiting enabled
- SQL injection protection via Prisma
- Environment variables for sensitive data
- CORS configuration
- Helmet.js for security headers

## 📈 Performance Optimization

- Database connection pooling
- Efficient pagination
- Indexed database queries
- Response compression
- Request logging for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Microsoft API Design Guidelines
- Express.js best practices
- Prisma documentation
