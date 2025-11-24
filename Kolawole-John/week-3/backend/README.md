# 🔒 Secure Task Management API with JWT & RBAC

**SE Challenge Week 3: Building a Secure, Token-Based Node.js API**

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [JWT Token Flow](#jwt-token-flow)
- [Security Implementation](#security-implementation)
- [OWASP Mitigation](#owasp-mitigation)
- [Testing Guide](#testing-guide)
- [Project Structure](#project-structure)

---

## 🎯 Project Overview

This project is a secure task management platform with **JWT-based authentication** and **Role-Based Access Control (RBAC)**. It demonstrates best practices in API security, focusing on mitigating critical OWASP vulnerabilities.

### Key Security Features:

- ✅ JWT Access & Refresh Token Authentication
- ✅ Role-Based Access Control (User & Admin)
- ✅ Account Locking (Brute Force Protection)
- ✅ Custom Input Validation & Sanitization
- ✅ XSS & SQL Injection Prevention
- ✅ Secure HTTP Headers (Helmet.js)
- ✅ Password Hashing (bcrypt)
- ✅ Token Blacklisting on Logout

---

## ✨ Features

### Authentication

- User registration with email validation
- Secure login with JWT token generation
- Access token (15 minutes) + Refresh token (7 days)
- Token refresh mechanism without re-login
- Secure logout with token revocation
- Account locking after 3 failed login attempts (30-minute lockout)

### Task Management

- Create, Read, Update tasks (User & Admin)
- Delete tasks (Admin only)
- Search tasks by title/description
- Filter tasks by status and priority
- Pagination support
- User-specific task isolation

### Role-Based Access Control

- **User Role:** Can create and view their own tasks
- **Admin Role:** Can create, view, update, and delete ANY task
- Middleware enforcement at route level
- Backend validation prevents privilege escalation

---

## 🛠️ Technology Stack

| Component             | Technology   | Version     |
| --------------------- | ------------ | ----------- |
| Runtime               | Node.js      | v18+        |
| Framework             | Express.js   | ^4.18.2     |
| Database              | MongoDB      | Atlas/Local |
| ODM                   | Mongoose     | ^7.5.0      |
| Authentication        | JWT          | ^9.0.2      |
| Password Hashing      | bcryptjs     | ^2.4.3      |
| Security Headers      | Helmet       | ^7.0.0      |
| CORS                  | cors         | ^2.8.5      |
| Environment Variables | dotenv       | ^16.3.1     |
| Frontend              | React + Vite | ^18.2.0     |
| HTTP Client           | Axios        | ^1.6.2      |
| Routing               | React Router | ^6.20.0     |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18 or higher
- MongoDB (Atlas or Local)
- npm or yarn

### Backend Setup

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd secure-task-api/backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the backend folder:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secure-task-api?retryWrites=true&w=majority

# JWT Secrets (Generate random strings for production!)
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Generate secure JWT secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Start the server:**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

**Expected output:**

```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Frontend Setup

1. **Navigate to frontend folder:**

```bash
cd ../frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm run dev
```

**Expected output:**

```
➜  Local:   http://localhost:5173/
```

4. **Open browser:**

```
http://localhost:5173
```

### Create Admin User

To test admin functionality, run the seed script:

**Create `backend/seedAdmin.js`:**

```javascript
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);

  const admin = new User({
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin created: admin / admin123");
  process.exit(0);
}

createAdmin();
```

**Run it:**

```bash
node seedAdmin.js
```

---

## 📡 API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

#### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Task Endpoints

#### Get All Tasks

```http
GET /api/tasks?page=1&limit=10
Authorization: Bearer <access_token>
```

**Access:** User (own tasks) | Admin (all tasks)

#### Get Single Task

```http
GET /api/tasks/:id
Authorization: Bearer <access_token>
```

#### Create Task

```http
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write comprehensive README",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

**Access:** User | Admin

#### Update Task

```http
PUT /api/tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in-progress"
}
```

**Access:** User (own tasks) | Admin (any task)

#### Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer <access_token>
```

**Access:** Admin Only ⚠️

#### Search Tasks

```http
POST /api/tasks/search
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "search": "documentation",
  "page": 1,
  "limit": 10
}
```

#### Filter Tasks

```http
POST /api/tasks/filter
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "pending",
  "priority": "high",
  "page": 1,
  "limit": 10
}
```

---

## 🔐 JWT Token Flow

### Token Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Login/Register                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  Server Generates Two Tokens:         │
        │  1. Access Token (15 min)             │
        │  2. Refresh Token (7 days)            │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │  Tokens Sent to Client                │
        │  - Access: Used for API requests      │
        │  - Refresh: Stored in localStorage    │
        └───────────────┬───────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────────┐       ┌───────────────────┐
│ API Request       │       │ Token Expires     │
│ with Access Token │       │ (after 15 min)    │
└─────┬─────────────┘       └─────┬─────────────┘
      │                           │
      ▼                           ▼
┌───────────────────┐       ┌───────────────────┐
│ Middleware        │       │ Frontend Uses     │
│ Validates Token   │       │ Refresh Token     │
└─────┬─────────────┘       │ to Get New Access │
      │                     └─────┬─────────────┘
      ▼                           │
┌───────────────────┐             │
│ If Valid:         │             │
│ Process Request   │             │
└───────────────────┘             │
                                  ▼
                        ┌───────────────────┐
                        │ Server Issues     │
                        │ New Access Token  │
                        └───────────────────┘
```

### Token Security Strategy

1. **Short-lived Access Tokens (15 minutes)**

   - Minimizes exposure window if token is compromised
   - Requires frequent refresh for security

2. **Long-lived Refresh Tokens (7 days)**

   - Stored in database for validation
   - Can be revoked on logout
   - Single refresh token can generate multiple access tokens

3. **Token Storage**

   - **Access Token:** localStorage (temporary, short-lived)
   - **Refresh Token:** localStorage + Database
   - Database storage enables server-side revocation

4. **Automatic Token Refresh**
   - Axios interceptor catches 401 errors
   - Automatically requests new access token
   - Seamless user experience (no re-login)

### Token Payload Structure

**Access Token:**

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Refresh Token:**

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "iat": 1234567890,
  "exp": 1235172690
}
```

---

## 🛡️ Security Implementation

### 1. Password Security (bcrypt)

**Implementation:**

```javascript
// Hashing on registration
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);

// Verification on login
const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
```

**Why bcrypt?**

- Adaptive hashing (slow by design)
- Built-in salt generation
- Resistant to rainbow table attacks
- Industry standard for password hashing

### 2. Account Locking (Brute Force Protection)

**Implementation:**

```javascript
// After failed login
user.loginAttempts++;
if (user.loginAttempts >= 3) {
  user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
}

// Check before allowing login
if (user.lockUntil && user.lockUntil > Date.now()) {
  return res.status(423).json({ message: "Account locked" });
}
```

**Features:**

- Locks account after 3 failed attempts
- 30-minute automatic unlock
- Prevents credential stuffing attacks
- Resets counter on successful login

### 3. Custom Input Validation

**No libraries used - all custom code:**

```javascript
// XSS Prevention
function sanitizeString(input) {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

// Email Validation
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

// Password Strength
function isValidPassword(password) {
  return (
    password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
  );
}
```

### 4. Role-Based Access Control (RBAC)

**Middleware Implementation:**

```javascript
function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
}

// Usage
router.delete("/tasks/:id", authenticate, authorize(["admin"]), deleteTask);
```

**Features:**

- Route-level authorization
- Role checked on every request
- Cannot be bypassed from frontend
- Database role is source of truth

### 5. Secure HTTP Headers (Helmet)

**Implementation:**

```javascript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: "same-origin" },
  })
);
```

**Protection Against:**

- XSS attacks
- Clickjacking
- MIME type sniffing
- Insecure referrer headers

---

## 🔒 OWASP Top 10 Mitigation

### A01:2021 - Broken Access Control

**Vulnerabilities Mitigated:**

1. **Unauthorized Function Access**

   - ❌ **Risk:** Regular users deleting tasks
   - ✅ **Mitigation:** Role-based middleware checks

   ```javascript
   router.delete("/tasks/:id", adminOnly, deleteTask);
   ```

2. **Insecure Direct Object References (IDOR)**

   - ❌ **Risk:** User A accessing User B's tasks
   - ✅ **Mitigation:** Ownership verification

   ```javascript
   if (role !== "admin" && task.createdBy !== userId) {
     return res.status(403).json({ message: "Access denied" });
   }
   ```

3. **Privilege Escalation**
   - ❌ **Risk:** User changing their role to admin
   - ✅ **Mitigation:** Role field not exposed in registration/update
   - Role can only be set via database admin

**Test Evidence:**

```bash
# User trying to delete (should fail)
DELETE /api/tasks/123
Authorization: Bearer <user_token>
Response: 403 Forbidden

# Admin deleting (should succeed)
DELETE /api/tasks/123
Authorization: Bearer <admin_token>
Response: 200 OK
```

### A03:2021 - Injection

**Vulnerabilities Mitigated:**

1. **SQL/NoSQL Injection**

   - ❌ **Risk:** Malicious query manipulation
   - ✅ **Mitigation:**
     - Mongoose parameterized queries
     - Custom input sanitization
     - No string concatenation in queries

2. **XSS (Cross-Site Scripting)**

   - ❌ **Risk:** `<script>alert('XSS')</script>` in task title
   - ✅ **Mitigation:**

   ```javascript
   function sanitizeString(input) {
     return input
       .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
       .replace(/javascript:/gi, "")
       .replace(/on\w+\s*=/gi, "");
   }
   ```

3. **Command Injection**
   - ❌ **Risk:** Malicious system commands
   - ✅ **Mitigation:** No `eval()` or `exec()` used anywhere

**Test Evidence:**

```javascript
// Input: <script>alert('XSS')</script>
// Stored: &lt;script&gt;alert('XSS')&lt;/script&gt;
// Rendered: Displayed as text, not executed
```

### A07:2021 - Identification and Authentication Failures

**Vulnerabilities Mitigated:**

1. **Weak Passwords**

   - ❌ **Risk:** Passwords like "123456"
   - ✅ **Mitigation:** Enforced password requirements
   - Must be 6+ characters with letters AND numbers

2. **Credential Stuffing**

   - ❌ **Risk:** Automated password guessing
   - ✅ **Mitigation:** Account locking after 3 attempts

3. **Session Fixation**
   - ❌ **Risk:** Stolen sessions remain valid
   - ✅ **Mitigation:** Token revocation on logout
   - Tokens stored in database and removed on logout

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### Authentication Tests

- [ ] Register with valid credentials
- [ ] Register with weak password (should fail)
- [ ] Register with existing username (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password 3 times (account locks)
- [ ] Wait 30 minutes, login again (account unlocks)
- [ ] Refresh token to get new access token
- [ ] Logout (token revoked)
- [ ] Try using old token after logout (should fail)

#### Task Management Tests

- [ ] Create task as user
- [ ] View own tasks
- [ ] Edit own task
- [ ] Try to view another user's task (should fail unless admin)
- [ ] Try to delete task as user (should fail)
- [ ] Login as admin
- [ ] Delete any task as admin (should succeed)
- [ ] Search tasks by title
- [ ] Filter tasks by status
- [ ] Filter tasks by priority

#### Security Tests

- [ ] Try XSS in task title: `<script>alert('XSS')</script>`
- [ ] Verify it's sanitized and displayed as text
- [ ] Try accessing admin route without admin role
- [ ] Verify 403 Forbidden response
- [ ] Try using expired access token
- [ ] Verify automatic token refresh works

### Using Thunder Client / Postman

1. **Import the collection** (create JSON file with all endpoints)
2. **Set up environment variables:**

   - `baseUrl`: `http://localhost:5000/api`
   - `accessToken`: (set after login)
   - `refreshToken`: (set after login)

3. **Test flow:**
   ```
   1. Register → Save tokens
   2. Create Task → Use accessToken
   3. Get Tasks → Verify task appears
   4. Logout → Token revoked
   5. Try Create Task → Should fail (401)
   ```

---

## 📁 Project Structure

```
secure-task-api/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── taskController.js    # Task CRUD logic
│   ├── middleware/
│   │   └── auth.js              # JWT & RBAC middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── taskRoutes.js        # Task endpoints
│   ├── utils/
│   │   ├── jwt.js               # Token generation/verification
│   │   └── validation.js        # Custom validation
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                # Entry point
│   └── README.md                # This file
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   ├── api.js           # Axios config
    │   │   └── auth.js          # Auth service
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── package.json
    └── README.md
```

---

## 📚 References & Resources

### Official Documentation

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [OWASP Top 10](https://owasp.org/Top10/)

### Learning Resources

- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [bcrypt vs other hashing algorithms](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/)

---

## 👤 Author

**Your Name**  
GitHub: https://github.com/clipwith-me  
Email: lekankolawolejohn@gmail.com

**Completed:** October 2025  
**Challenge:** SE Challenge Week 3 - Secure Multi-Role API Development

---

## 📄 License

This project is created for educational purposes as part of SE Challenge Week 3.

---

## 🙏 Acknowledgments

- SE Challenge organizers
- OWASP Foundation for security guidelines
- Node.js community for excellent documentation
