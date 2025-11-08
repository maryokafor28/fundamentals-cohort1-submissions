# CodePilot Backend API

A comprehensive Node.js Express backend with robust testing strategy, designed for high coverage and confidence in deployment.

## 🏗️ Architecture

The backend follows a modular architecture with clear separation of concerns:

```
src/
├── modules/
│   ├── auth/          # Authentication module
│   ├── products/      # Product management module
│   └── orders/        # Order management module
├── tests/             # Test suite
└── app.js            # Main application entry
```

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🧪 Testing Strategy

Our testing strategy ensures both **coverage** and **confidence** through multiple testing levels:

### 1. Unit Tests
- **Purpose**: Test individual functions and methods in isolation
- **Coverage**: Business logic, validation, error handling
- **Tools**: Jest
- **Files**: `src/tests/*.test.js`

### 2. Integration Tests
- **Purpose**: Test API endpoints and service interactions
- **Coverage**: HTTP requests/responses, middleware, routing
- **Tools**: Jest + Supertest
- **Files**: `src/tests/integration.test.js`

### 3. Coverage Requirements
- **Minimum**: 80% code coverage
- **Reports**: Generated in `/coverage` directory
- **CI/CD**: Automated coverage checks on every push

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests for CI (no watch)
npm run test:ci
```

### Coverage Reports
After running tests with coverage, open `coverage/lcov-report/index.html` in your browser to view detailed coverage reports.

## 📊 Test Confidence Metrics

Our testing strategy ensures confidence through:

1. **Comprehensive Coverage**: All critical paths tested
2. **Error Scenarios**: Negative test cases for all endpoints
3. **Data Validation**: Input validation and sanitization tests
4. **Integration Testing**: End-to-end workflow validation
5. **Automated CI/CD**: Tests run on every commit

## 🔄 CI/CD Pipeline

GitHub Actions automatically:
- Runs tests on Node.js 18.x and 20.x
- Generates coverage reports
- Enforces 80% coverage threshold
- Performs security audits
- Uploads coverage artifacts

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Token verification

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get orders by user
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

### Health Check
- `GET /health` - Application health status

## 📋 Postman Collection

Import `postman_collection.json` into Postman for comprehensive API testing. The collection includes:
- Pre-configured environment variables
- Automated token management
- Complete endpoint coverage
- Example requests and responses

## 🛡️ Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation and sanitization
- JWT token authentication
- Password hashing with bcrypt

## 🔧 Environment Variables

```bash
PORT=3000                    # Server port
NODE_ENV=development         # Environment
JWT_SECRET=your-secret-key   # JWT signing secret
```

## 📈 Test Coverage Goals

| Module | Unit Tests | Integration Tests | Target Coverage |
|--------|------------|-------------------|-----------------|
| Auth | ✅ Login, Register, Verify | ✅ API endpoints | 90%+ |
| Products | ✅ CRUD operations | ✅ API endpoints | 85%+ |
| Orders | ✅ Business logic | ✅ API endpoints | 85%+ |
| **Overall** | **✅ Complete** | **✅ Complete** | **80%+** |

## 🚦 Quality Gates

Before deployment, code must pass:
1. All unit tests (100% pass rate)
2. All integration tests (100% pass rate)
3. Minimum 80% code coverage
4. Security audit (no high/critical vulnerabilities)
5. Linting checks (if configured)

## 🔍 Testing Best Practices Implemented

1. **Arrange-Act-Assert Pattern**: Clear test structure
2. **Descriptive Test Names**: Self-documenting test cases
3. **Edge Case Testing**: Boundary conditions and error scenarios
4. **Mocking**: Isolated unit tests with proper mocking
5. **Test Data Management**: Consistent test data setup
6. **Async Testing**: Proper handling of promises and async operations

## 📝 Development Workflow

1. Write failing tests first (TDD approach)
2. Implement minimal code to pass tests
3. Refactor while maintaining test coverage
4. Run full test suite before commits
5. CI/CD validates all changes automatically

This testing strategy ensures that every deployment is safe and reliable, giving the team confidence in the system's stability and functionality.