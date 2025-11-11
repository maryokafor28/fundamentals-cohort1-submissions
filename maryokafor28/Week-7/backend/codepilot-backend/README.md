# CodePilot Backend

A comprehensive Node.js (Express + TypeScript) backend API with robust testing strategy, featuring authentication, user management, and product management modules.

[![CI Status](https://github.com/maryokafor28/codepilot-backend/actions/workflows/test.yml/badge.svg)](https://github.com/maryokafor28/codepilot-backend/actions)

**Live API:** https://codepilot-backend.onrender.com

**API Documentation:** [View Postman Collection](https://documenter.getpostman.com/view/48798242/2sB3WsNz68)

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Testing Strategy](#-testing-strategy)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Deployment]()
- [Contributing](#-contributing)

---

## Features

- **Authentication & Authorization** - JWT-based auth with secure password hashing
- **User Management** - CRUD operations for user profiles
- **Product Management** - Complete product catalog system
- **Comprehensive Testing** - Unit, Integration, and E2E tests
- **Code Coverage** - 85%+ coverage across all modules
- **CI/CD Pipeline** - Automated testing with GitHub Actions
- **API Documentation** - Complete Postman collection
- **Security** - Input validation, error handling, and secure practices

---

## Tech Stack

**Runtime & Framework:**

- Node.js (v18+)
- Express.js
- TypeScript

**Database:**

- MongoDB with Mongoose ODM

**Authentication:**

- JSON Web Tokens (JWT)
- bcrypt for password hashing

**Testing:**

- Jest - Testing framework
- Supertest - API integration testing
- ts-jest - TypeScript support for Jest

**DevOps:**

- GitHub Actions - CI/CD
- Render - Deployment platform
- MongoDB Atlas - Database hosting

---

## Project Structure

```
codepilot-backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controller.ts      # Auth request handlers
│   │   │   ├── service.ts         # Auth business logic
│   │   │   └── routes.ts          # Auth endpoints
│   │   ├── users/
│   │   │   ├── model.ts           # User schema & model
│   │   │   ├── controller.ts      # User request handlers
│   │   │   ├── service.ts         # User business logic
│   │   │   └── routes.ts          # User endpoints
│   │   └── products/
│   │       ├── model.ts           # Product schema & model
│   │       ├── controller.ts      # Product request handlers
│   │       ├── service.ts         # Product business logic
│   │       └── routes.ts          # Product endpoints
│   ├── middleware/
│   │   ├── auth.ts                # JWT authentication
│   │   └── errorHandler.ts       # Global error handling
│   ├── routes/
│   │   ├── index.ts                # JWT authentication
│   ├── config/
│   │   └── db.ts                  # MongoDB connection
│   ├── utils/
│   │   └── token.ts               # JWT utilities
│   ├── app.ts                     # Express app setup
│   └── server.ts                  # Server entry point
├── __tests__/
│   ├── unit/
│   │   ├── auth/
│   │   │   └── service.test.ts    # Auth service unit tests
│   │   ├── users/
│   │   │   └── service.test.ts    # User service unit tests
│   │   └── products/
│   │       └── service.test.ts    # Product service unit tests
│   ├── integration/
│   │   ├── auth.test.ts           # Auth API integration tests
│   │   ├── users.test.ts          # User API integration tests
│   │   └── products.test.ts       # Product API integration tests
│   └── e2e/
│   └── setup/
│       └── dbSetup.ts
│       └── helper.ts.ts
├── .github/
│   └── workflows/
│       └── test.yml               # CI/CD pipeline
├── coverage/                       # Generated coverage reports (gitignored)
├── dist/                          # Compiled JavaScript (gitignored)
├── .env                           # Environment variables (gitignored)
├── .gitignore
├── jest.config.js                 # Jest configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/maryokafor28/codepilot-backend.git
   cd codepilot-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codepilot?retryWrites=true&w=majority (or use the local mongodb)
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:5000`

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server (requires build first)
npm test             # Run all tests
npm test -- --watch  # Run tests in watch mode
npm test -- --coverage  # Generate coverage report
```

---

## Testing Strategy

### Overview

My testing strategy follows the **Testing Pyramid** approach, ensuring both **broad coverage** and **high confidence** in code reliability. We implement three layers of testing that work together to catch bugs at different levels of the application.

### 🧩 Step 3: Combine Results Manually

| Test Type              | Command Run                                 | Coverage (Lines %) | Number of Tests | Share of Total |
| ---------------------- | ------------------------------------------- | ------------------ | --------------- | -------------- |
| Unit Tests             | `npx jest --coverage tests/unit`            | **27.22%**         | 23              | 60%            |
| Integration Tests      | `npx jest --coverage src/tests/integration` | **79.2%**          | 14              | 30%            |
| End-to-End (E2E) Tests | `npx jest --coverage src/tests/e2e`         | **80.69%**         | 32              | 10%            |

### Testing Pyramid

```
        ▲
        |  E2E Tests — 80.69% coverage
        |  (10% of total tests, full workflow)
        |
        |  Integration Tests — 79.2% coverage
        |  (30% of total tests, cross-module behavior)
        |
        |  Unit Tests — 27.22% coverage
        |  (60% of total tests, isolated logic)
        ▼
```

### 1. Unit Tests (60% of test suite)

**Purpose:** Test individual functions and business logic in complete isolation.

**What we test:**

- Service layer functions (auth, users, products)
- Utility functions (token generation/verification)
- Business logic and edge cases

**Tools:** Jest with mocked dependencies

**Coverage focus:**

- Error handling (invalid input, duplicate entries)
- Edge cases (empty data, null values)
- Security validations

**Why this gives confidence:**

- Pinpoints exact location of bugs
- Fast feedback (runs in milliseconds)
- Tests business logic independently
- Easy to test edge cases

---

### 2. Integration Tests (30% of test suite)

**Purpose:** Test how multiple components work together, including API routes, controllers, services, and database interactions.

**What we test:**

- Complete HTTP request/response cycle
- Route → Controller → Service → Database flow
- Middleware functionality (auth, error handling)
- Data persistence and retrieval

**Tools:** Jest + Supertest + Real test database

**Example flows tested:**

- User registration → Database entry → Response validation
- Login → JWT generation → Token validation
- Protected routes → Auth middleware → User data access
- CRUD operations on products

**Coverage focus:**

- HTTP status codes (200, 201, 400, 401, 404, 409)
- Response body structure
- Authentication flow
- Data validation and constraints
- Error messages

**Why this gives confidence:**

- Tests real API behavior
- Validates entire request flow
- Catches integration issues between layers
- Ensures database operations work correctly

---

### 3. End-to-End (E2E) Tests (10% of test suite)

**Purpose:** Test complete user workflows from start to finish, simulating real-world usage scenarios.

**What we test:**

- Multi-step user journeys
- State management across requests
- Authentication persistence
- Complex workflows involving multiple modules

**Tools:** Jest + Supertest + Test database

**Example workflows tested:**

1. **Complete User Journey:**

   - Register → Login → Get token → Access protected resource → Update profile

2. **Product Management Flow:**

   - Create product → List all products → Get specific product → Update product → Delete product

3. **Authentication Flow:**
   - Register → Login → Access dashboard → Logout → Attempt access (should fail)

**Coverage focus:**

- Complete user stories
- Token-based authentication across requests
- Data consistency
- Real-world usage patterns

**Why this gives confidence:**

- Validates real user scenarios
- Tests complete feature functionality
- Catches issues that only appear in multi-step flows
- Ensures production-like behavior

---

### Coverage Metrics

Our test suite maintains high coverage across all modules:

| Metric         | Target | Current |
| -------------- | ------ | ------- |
| **Statements** | ≥ 80%  | 85.45%  |
| **Branches**   | ≥ 75%  | 66.03%  |
| **Functions**  | ≥ 85%  | 88.46%  |
| **Lines**      | ≥ 80%  | 86.45%  |

Overall: 9 test suites, 69 tests — all passing

**Generate coverage report:**

```bash
npm test -- --coverage
```

View detailed HTML report: `coverage/lcov-report/index.html`

---

### Continuous Integration

All tests run automatically on every push and pull request via **GitHub Actions**:

**Workflow includes:**

- Run tests on Node.js 18.x and 20.x
- Generate coverage reports
- Fail PR if tests don't pass
- Ensure code quality before merge

**View CI status:** Check the badge at the top of this README or visit the [Actions tab](https://github.com/maryokafor28/codepilot-backend/actions).

---

### Testing Best Practices Applied

1. **Isolation:** Each test is independent and can run in any order
2. **Clear naming:** Test names describe exactly what is being tested
3. **DRY principle:** Reusable test utilities and setup
4. **Realistic data:** Test with data similar to production
5. **Cleanup:** Database is cleaned after each test
6. **Fast execution:** Unit tests run in <5 seconds
7. **Comprehensive coverage:** All critical paths tested

---

### Confidence Through Testing

The multi-layered testing approach ensures:

**Individual functions work correctly** (Unit tests)
✅ **Components integrate properly** (Integration tests)
✅ **Complete features function as expected** (E2E tests)
✅ **Production deployments are safe** (CI/CD validation)

---

### Complete Documentation

For detailed request/response examples, see the [Postman Collection](https://documenter.getpostman.com/view/48798242/2sB3WsNz68).

---

## Deployment

### Deployed on Render

**Live URL:** https://codepilot-backend.onrender.com

**Deployment Process:**

1. Push to `main` branch triggers automatic deployment
2. GitHub Actions runs all tests
3. If tests pass, Render builds and deploys
4. Zero-downtime deployment

### Database

**Hosted on MongoDB Atlas:**

- Free tier (M0 Sandbox)
- Automated backups
- Network security configured

---

**Ensure all tests pass before submitting:**

```bash
npm test
```

---

## Author

**Mary Amadi**

- GitHub: [@maryokafor28](https://github.com/maryokafor28)
- Email: vincyokafor@gmail,com

---
