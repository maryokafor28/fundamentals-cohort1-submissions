# 🔒 Secure Task Management API

A production-ready RESTful API built with Node.js, Express, and MongoDB, featuring JWT authentication, role-based access control (RBAC), and comprehensive security measures following OWASP best practices.

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Security Implementation](#security-implementation)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [JWT Token Strategy](#jwt-token-strategy)
- [OWASP Security Mitigations](#owasp-security-mitigations)
- [Project Structure](#project-structure)

---

## ✨ Features

### Authentication & Authorization
- ✅ User registration with email validation
- ✅ Secure login with JWT (access + refresh tokens)
- ✅ Token refresh mechanism (no re-login required)
- ✅ **Account lockout after 3 failed login attempts**
- ✅ **Automatic unlock after 30 minutes**
- ✅ Token blacklisting on logout
- ✅ Role-based access control (User & Admin roles)

### Task Management
- ✅ Create tasks (User, Admin)
- ✅ View tasks (role-based filtering)
- ✅ Delete tasks (Admin only)
- ✅ Search tasks with keyword (paginated)
- ✅ Filter tasks by status (paginated)
- ✅ **User-scoped data** (users see only their tasks)

### Security Features
- ✅ Custom input validation (NO external libraries)
- ✅ SQL injection prevention
- ✅ XSS attack prevention
- ✅ HTML sanitization
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Security headers (Helmet.js)
- ✅ Rate limiting (prevent brute force)
- ✅ CORS configuration

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js v16+ |
| Framework | Express.js |
| Database | MongoDB |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| Security | Helmet.js |
| Testing | Jest + Supertest |
| Validation | Custom (no libraries) |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v16 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Tjoseph-O/task-management-api.git
cd task-management-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/secure-task-db

# JWT Configuration
JWT_ACCESS_SECRET=your_super_secret_access_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=7d

# Security Configuration
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=3
LOCK_TIME=30

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB:**

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

5. **Run the application:**

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

6. **Verify server is running:**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-01-10T12:00:00.000Z"
}
```

---

## 🧪 Testing

### Run Tests

```bash

npm test


npm run test:coverage


npm test tests/authController.test.js
```

### Test Results

**Total: 83 tests**

- ✅ Validators (22 tests)
- ✅ JWT Utils (9 tests)
- ✅ Auth Controller (17 tests)
- ✅ Task Controller (17 tests)
- ✅ Middleware (18 tests)

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

---

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Failed Login (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Account Locked (423):**
```json
{
  "success": false,
  "message": "Account is locked. Please try again in 25 minutes."
}
```

---

#### 3. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 4. Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Task Endpoints

#### 5. Get All Tasks
```http
GET /api/tasks
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project",
      "description": "Finish the task management API",
      "status": "in-progress",
      "userId": "507f1f77bcf86cd799439012",
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

**Note:** 
- Regular users see only their tasks
- Admin users see all tasks

---

#### 6. Create Task
```http
POST /api/tasks
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "userId": "507f1f77bcf86cd799439012",
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  }
}
```

**Status Options:**
- `pending` (default)
- `in-progress`
- `completed`

---

#### 7. Delete Task (Admin Only)
```http
DELETE /api/tasks/{taskId}
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Forbidden: Only admins can delete tasks"
}
```

---

#### 8. Search Tasks
```http
POST /api/tasks/search
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "keyword": "project",
  "page": 1,
  "limit": 10
}
```

**Response (200):**
```json
{
  "success": true,
  "tasks": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "limit": 10
  }
}
```

**Note:** Regular users search only returns their own tasks.

---

#### 9. Filter Tasks
```http
POST /api/tasks/filter
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "completed",
  "page": 1,
  "limit": 10
}
```

**Response (200):**
```json
{
  "success": true,
  "tasks": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "limit": 10
  }
}
```

**Note:** Regular users filter only returns their own tasks.

---

## 🎫 JWT Token Strategy

### Token Types

**Access Token (Short-lived - 30 minutes):**
```javascript
Payload: {
  userId: "507f1f77bcf86cd799439011",
  role: "user",
  iat: 1704884400,
  exp: 1704886200
}
```

**Purpose:**
- Used for API authentication
- Short expiry for security
- Included in Authorization header

**Refresh Token (Long-lived - 7 days):**
```javascript
Payload: {
  userId: "507f1f77bcf86cd799439011",
  tokenId: "unique-token-id",
  iat: 1704884400,
  exp: 1705489200
}
```

**Purpose:**
- Used to obtain new access tokens
- Stored in database (user's refreshTokens array)
- Blacklisted on logout

### Token Flow

```
1. Login
   ↓
2. Receive Access Token (30m) + Refresh Token (7d)
   ↓
3. Use Access Token for API requests
   ↓
4. Access Token expires
   ↓
5. Send Refresh Token to /api/auth/refresh
   ↓
6. Receive new Access Token
   ↓
7. Continue using API
   ↓
8. Logout → Refresh Token blacklisted
```

### Token Storage (Frontend Integration)

**❌ NOT Recommended: localStorage**
- Vulnerable to XSS attacks
- Accessible by any JavaScript
- Persists across sessions

**✅ Recommended: sessionStorage + Memory**
- Access token in React state (memory)
- Also stored in sessionStorage for page refreshes
- Cleared when browser closes
- Reduced XSS attack surface

**✅ Best Practice: HttpOnly Cookies (Future Enhancement)**
- Managed by backend
- Not accessible via JavaScript
- Automatic inclusion in requests
- Most secure option

---

## 🛡️ OWASP Security Mitigations

### A01: Broken Access Control

**Problem:** Unauthorized users accessing resources or performing actions beyond their privileges.

**Our Implementation:**

#### 1. Role-Based Access Control (RBAC)

```javascript
// middleware/authorize.js
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions'
      });
    }

    next();
  };
}
```

#### 2. Access Control Matrix

| Endpoint | User | Admin | Implementation |
|----------|------|-------|----------------|
| GET /api/tasks | ✅ Own tasks only | ✅ All tasks | User-scoped query |
| POST /api/tasks | ✅ | ✅ | Role check |
| DELETE /api/tasks/:id | ❌ | ✅ | Admin-only middleware |
| POST /api/tasks/search | ✅ Own tasks only | ✅ All tasks | User-scoped query |
| POST /api/tasks/filter | ✅ Own tasks only | ✅ All tasks | User-scoped query |

#### 3. User-Scoped Data Access

```javascript
// Regular users see only their tasks
if (role !== 'admin') {
  query.userId = userId;
}

const tasks = await Task.find(query);
```

**Benefits:**
- Users cannot access other users' tasks
- Admin has full visibility
- Enforced at database query level
- Cannot be bypassed client-side

---

### A03: Injection Attack Prevention

**Problem:** Malicious data sent to interpreters (SQL, NoSQL, XSS) to execute unintended commands.

**Our Implementation:**

#### 1. Custom Input Validation (No External Libraries)

```javascript
// utils/validators.js

// Email Validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dangerousChars = /[';"`\\]/;
  const sqlKeywords = /(DROP|DELETE|INSERT|UPDATE|SELECT)/i;
  
  if (dangerousChars.test(email) || sqlKeywords.test(email)) {
    return false;
  }
  
  return emailRegex.test(email);
}

// Input Sanitization
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  let sanitized = input;
  
  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>"`]/g, '');
  
  // Remove SQL injection patterns
  sanitized = sanitized.replace(/;\s*(DROP|DELETE|INSERT|UPDATE|UNION\s+SELECT)/gi, '');
  sanitized = sanitized.replace(/UNION\s+SELECT/gi, '');
  
  return sanitized.trim();
}

// Password Validation
function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

#### 2. Applied Validation

**Registration Endpoint:**
```javascript
// Sanitize inputs
email = sanitizeInput(email).toLowerCase();

// Validate email
if (!validateEmail(email)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid email format'
  });
}

// Validate password
const passwordValidation = validatePassword(password);
if (!passwordValidation.isValid) {
  return res.status(400).json({
    success: false,
    message: 'Password does not meet requirements',
    errors: passwordValidation.errors
  });
}
```

**Task Creation Endpoint:**
```javascript
// Sanitize task inputs
title = sanitizeInput(title);
description = sanitizeInput(description);

// Validate
const validation = validateTaskInput(title, description);
if (!validation.isValid) {
  return res.status(400).json({
    success: false,
    errors: validation.errors
  });
}
```

#### 3. Protection Against Common Attacks

**SQL Injection:**
```bash
# Attack attempt
email: "admin'--@test.com"
password: "' OR '1'='1"

# Result: ❌ Rejected by validateEmail()
```

**XSS Attack:**
```bash
# Attack attempt
title: "<script>alert('xss')</script>"
description: "<img src=x onerror=alert('xss')>"

# Result: ❌ Sanitized to: "alertxss" and "alert('xss')"
```

**NoSQL Injection:**
```bash
# Attack attempt
{ "$gt": "" }

# Result: ❌ Type checking rejects non-string inputs
```

#### 4. Additional Security Layers

- ✅ Parameterized MongoDB queries (via Mongoose)
- ✅ Input type validation
- ✅ Length restrictions (title: 100, description: 500)
- ✅ Content Security Policy headers (Helmet)
- ✅ XSS protection headers

---

## 👥 User Management

### Creating an Admin User

By default, all registered users have the `user` role. To create an admin:

**Method 1: MongoDB Shell**
```bash
mongosh
use secure-task-db
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Method 2: Admin Creation Script**

Create `createAdmin.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const email = 'admin@example.com';
  const password = 'AdminPass123!';
  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    email,
    password: hashedPassword,
    role: 'admin'
  });

  console.log('✅ Admin user created!');
  console.log('Email:', email);
  console.log('Password:', password);
  
  process.exit(0);
}

createAdmin();
```

Run:
```bash
node createAdmin.js
```

---

## 📁 Project Structure

```
secure-task-api/
├── config/
│   └── database.js              # MongoDB connection
├── controllers/
│   ├── authController.js        # Authentication logic
│   └── taskController.js        # Task CRUD operations
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── authorize.js             # RBAC enforcement
│   └── validate.js              # Input validation
├── models/
│   ├── User.js                  # User schema
│   ├── Task.js                  # Task schema
│   └── BlacklistedToken.js      # Token blacklist
├── routes/
│   ├── auth.js                  # Auth endpoints
│   └── tasks.js                 # Task endpoints
├── utils/
│   ├── validators.js            # Custom validators
│   └── jwtUtils.js              # JWT helpers
├── tests/
│   ├── setup.js                 # Test configuration
│   ├── validators.test.js       # Validator tests
│   ├── jwtUtils.test.js         # JWT tests
│   ├── authController.test.js   # Auth tests
│   ├── taskController.test.js   # Task tests
│   └── middleware.test.js       # Middleware tests
├── .env                         # Environment variables
├── .gitignore
├── jest.config.js               # Jest configuration
├── package.json
├── server.js                    # Application entry point
└── README.md
```

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to version control
   - Use strong, unique secrets in production
   - Rotate secrets regularly

2. **Password Security**
   - Minimum 8 characters with complexity requirements
   - bcrypt with 12 rounds
   - Account lockout after 3 failed attempts

3. **Token Security**
   - Short-lived access tokens (30 minutes)
   - Refresh token rotation
   - Token blacklisting on logout
   - Secure token storage (not localStorage)

4. **Input Validation**
   - Validate all user inputs
   - Sanitize before database operations
   - Enforce length limits
   - Type checking

5. **API Security**
   - Rate limiting (5 login attempts per 15 minutes)
   - CORS configuration
   - Security headers (Helmet)
   - HTTPS in production (recommended)

---

## 📊 Performance Considerations

- MongoDB indexes on frequently queried fields
- Pagination on list endpoints (default: 10 items)
- Connection pooling
- TTL index for automatic token cleanup

---

## 🚧 Known Limitations

1. Email verification not implemented
2. Password reset not implemented
3. 2FA not implemented
4. Audit logging not implemented
5. File uploads not supported

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Built as a demonstration of secure web application development following OWASP guidelines and modern security practices.

---

## 🙏 Acknowledgments

- OWASP for security guidelines
- Express.js community
- MongoDB documentation
- Jest testing framework