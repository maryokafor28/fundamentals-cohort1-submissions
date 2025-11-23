# FlowServe Backend API

A scalable and reliable RESTful API for processing real-time transactions and digital wallet operations.

## 🚀 Features

- ✅ RESTful API architecture
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Comprehensive error handling
- ✅ Request validation with Joi
- ✅ Rate limiting for API protection
- ✅ Winston logging for monitoring
- ✅ Security best practices (Helmet, CORS)
- ✅ Test-Driven Development (TDD) with Jest
- ✅ Modular and scalable codebase

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd flowserve-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flowserve_db
DB_USER=your_username
DB_PASSWORD=your_password

# Security
JWT_SECRET=your-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Setup PostgreSQL Database

Create the database:

```bash
psql -U postgres
CREATE DATABASE flowserve_db;
\q
```

Run migrations:

```bash
npm run db:migrate
```

## 🏃‍♂️ Running the Application

### Development mode (with auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 🧪 Testing

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run integration tests only

```bash
npm run test:integration
```

### View test coverage

```bash
npm test -- --coverage
```

## 📁 Project Structure

```
flowserve-backend/
├── src/
│   ├── config/          # Configuration files (database, logger)
│   ├── models/          # Database models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── tests/           # Test files
│   ├── app.js           # Express application setup
│   └── index.js         # Server entry point
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Check API health status

### Users (Coming soon)
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Transactions (Coming soon)
- `POST /api/transactions` - Create a transaction
- `GET /api/transactions` - Get all transactions (with pagination)
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/users/:userId/transactions` - Get user's transactions

## 📚 API Documentation

Full API documentation is available in Postman:
[Postman Documentation Link] (to be added)

## 🔒 Security Features

- **Helmet**: Secures Express apps by setting various HTTP headers
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Rate Limiting**: Prevents abuse by limiting repeated requests
- **Input Validation**: Request validation using Joi
- **Error Handling**: Comprehensive error handling middleware

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Using Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Deploy

### Using Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

## 📝 Development Workflow (TDD)

This project follows Test-Driven Development:

1. **RED**: Write a failing test
2. **GREEN**: Write minimal code to pass the test
3. **REFACTOR**: Improve code while keeping tests green

Example:
```javascript
// 1. Write test first (RED)
test('should create a user', async () => {
  const user = await User.create({ email: 'test@example.com' });
  expect(user.id).toBeDefined();
});

// 2. Implement feature (GREEN)
// 3. Refactor and optimize (REFACTOR)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your feature
4. Implement the feature
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Express.js community
- Sequelize documentation
- Jest testing framework

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Built with ❤️ for FlowServe**# flowserve-backend
