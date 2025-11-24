# CodePilot Backend API

> A production-ready Node.js/Express API with comprehensive testing strategy ensuring both coverage and confidence.

![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-80%25+-brightgreen)
![Node](https://img.shields.io/badge/node-18%2B-blue)

## 🎯 Project Overview

CodePilot is an internal developer platform API built with a focus on reliability through comprehensive testing. This project demonstrates industry best practices for test-driven development, achieving both high code coverage (>80%) and real-world confidence in system reliability.

## 🏗️ Architecture

```
src/
├── config/           # Configuration management
├── models/           # Data models (in-memory DB)
├── services/         # Business logic layer
│   ├── authService.js
│   ├── productService.js
│   └── orderService.js
├── routes/           # API route handlers
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── middleware/       # Express middleware
├── app.js           # Express application setup
└── server.js        # Server entry point

__tests__/
├── unit/            # Unit tests for services
├── integration/     # Integration tests for routes
└── e2e/             # End-to-end workflow tests
```

## 📋 Features

### Core Modules
- **Authentication** - User registration, login, JWT token management
- **Products** - CRUD operations, stock management
- **Orders** - Order creation, status tracking, cancellation with stock restoration

### Testing Infrastructure
- **Unit Tests** - Isolated service layer testing
- **Integration Tests** - API endpoint testing with Supertest
- **E2E Tests** - Complete workflow validation
- **Coverage Reports** - Generated with Jest coverage tooling
- **CI/CD Pipeline** - Automated testing on GitHub Actions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd codepilot-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 🧪 Testing Strategy

### Philosophy

Our testing strategy balances two critical metrics:

1. **Coverage** - Quantitative measure ensuring code execution
2. **Confidence** - Qualitative measure ensuring real-world reliability

### Test Pyramid

```
        /\
       /  \
      / E2E \       - Complete user workflows
     /________\
    /          \
   / Integration\   - API routes + services
  /______________\
 /                \
/    Unit Tests    \ - Individual functions
\__________________/
```

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # E2E tests only

# Watch mode for TDD
npm run test:watch

# CI mode
npm run test:ci
```

### Coverage Requirements

We enforce minimum coverage thresholds:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

View coverage report:
```bash
npm test
# Open coverage/lcov-report/index.html in browser
```

## 📊 Test Organization

### Unit Tests (`__tests__/unit/`)
Focus on individual service methods in isolation:
- Input validation
- Business logic correctness
- Error handling
- Edge cases

**Example**: `authService.test.js`
- Tests password hashing
- Validates token generation
- Checks error scenarios

### Integration Tests (`__tests__/integration/`)
Test API endpoints with actual HTTP requests:
- Request/response validation
- Authentication middleware
- Error responses
- Status codes

**Example**: `authRoutes.test.js`
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (protected)

### E2E Tests (`__tests__/e2e/`)
Validate complete user workflows:
- Multi-step operations
- State management
- Cross-module interactions
- Real-world scenarios

**Example**: Complete order workflow
1. User registration
2. Login and authentication
3. Product creation
4. Order placement
5. Stock verification
6. Order cancellation

## 📈 Test Coverage Highlights

Current coverage (as of latest run):

| Module | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| Services | 95% | 90% | 95% | 95% |
| Routes | 88% | 85% | 90% | 88% |
| Middleware | 100% | 100% | 100% | 100% |
| **Overall** | **92%** | **88%** | **92%** | **92%** |

## 🔗 API Documentation

### Postman Collection

Import the Postman collection for easy API testing:
- [Download Collection JSON](./postman_collection.json)
- Or use this link: [View in Postman](#)

### Key Endpoints

#### Authentication
```
POST   /api/auth/register   - Register new user
POST   /api/auth/login      - Login user
GET    /api/auth/me         - Get current user (protected)
```

#### Products
```
POST   /api/products        - Create product (protected)
GET    /api/products        - Get all products
GET    /api/products/:id    - Get product by ID
PUT    /api/products/:id    - Update product (protected)
DELETE /api/products/:id    - Delete product (protected)
```

#### Orders
```
POST   /api/orders              - Create order (protected)
GET    /api/orders              - Get user's orders (protected)
GET    /api/orders/:id          - Get order by ID (protected)
PATCH  /api/orders/:id/status   - Update order status (protected)
POST   /api/orders/:id/cancel   - Cancel order (protected)
GET    /api/orders/user/stats   - Get order statistics (protected)
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - Prevent abuse
- **Helmet.js** - Security headers
- **CORS** - Controlled cross-origin requests
- **Input Validation** - Express-validator on all routes

## 🛠️ Development Practices

### Code Quality
- ESLint for code linting
- Consistent error handling
- Clear separation of concerns
- Comprehensive documentation

### Testing Best Practices
1. **AAA Pattern** - Arrange, Act, Assert
2. **Test Isolation** - Each test is independent
3. **Descriptive Names** - Clear test descriptions
4. **Mock External Dependencies** - No real DB/API calls in tests
5. **Setup/Teardown** - Clean state for each test

### Example Test Structure
```javascript
describe('ServiceName', () => {
  beforeEach(() => {
    // Setup test data
  });

  describe('methodName()', () => {
    it('should do something when condition is met', async () => {
      // Arrange
      const input = { /* test data */ };
      
      // Act
      const result = await service.method(input);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.property).toBe(expected);
    });

    it('should throw error when invalid input provided', async () => {
      // Test error scenarios
    });
  });
});
```

## 📦 Deployment

### Environment Variables
Required for production:
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Deployment Platforms
Tested and ready for:
- **Render** - `npm start`
- **Railway** - `npm start`
- **Heroku** - Uses Procfile
- **AWS/GCP/Azure** - Docker ready

### Health Check
```
GET /health
```
Returns server status and environment info.

## 🤝 Contributing

### Running Tests Before Commit
```bash
# Run all tests
npm test

# Verify linting
npm run lint

# Fix lint issues
npm run lint:fix
```

### CI/CD Pipeline
All PRs trigger automated tests:
- Runs on Node 18.x and 20.x
- Must pass all test suites
- Coverage report posted to PR
- Must meet 80% coverage threshold

## 📚 Learning Resources

- [Test Driven JavaScript Development PDF](#)
- [Kent C. Dodds - Testing Strategies](https://kentcdodds.com/blog/write-tests)
- [Jest Documentation](https://jestjs.io/)
- [Supertest for HTTP Testing](https://github.com/visionmedia/supertest)

## 🎓 Key Takeaways

### Why This Testing Strategy Works

1. **Catches Bugs Early** - Unit tests catch logic errors immediately
2. **Prevents Regressions** - Integration tests ensure features don't break
3. **Validates User Flows** - E2E tests confirm real-world scenarios work
4. **Enables Refactoring** - High test coverage allows safe code changes
5. **Builds Confidence** - Team can deploy knowing tests have their back

### Coverage vs Confidence

**Coverage alone isn't enough.** You could have 100% coverage testing trivial code while missing critical workflows. Our strategy combines:

- **High coverage** (>80%) ensures code is executed
- **Meaningful tests** ensure code behaves correctly
- **E2E scenarios** validate real user experiences
- **Edge case testing** catches unexpected failures

## 🐛 Troubleshooting

### Tests Failing
```bash
# Clear Jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose

# Run specific test file
npm test -- __tests__/unit/authService.test.js
```

### Coverage Not Generated
```bash
# Ensure coverage directory exists
mkdir -p coverage

# Run with explicit coverage flag
npm test -- --coverage
```

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

Built by the CodePilot Engineering Team for the Software Engineering Week 7 Challenge

---

**Remember**: Tests are not just about coverage numbers. They're about confidence in your code. Write tests that give you peace of mind when deploying to production.
