Secure Task Management API

(URL= https://taskassig.netlify.app/) 
Admin: admin@example.com password: Admin123456      User: josephsammy1994@gmai.com password: Mayowa2211.

Enterprise-grade Node.js/Express API implementing JWT authentication, role-based access control (RBAC), and comprehensive security measures to mitigate OWASP Top 10 vulnerabilities.

## 🏗️ Architecture Overview

This API demonstrates production-ready security practices including:
- **JWT Authentication** with access/refresh token rotation
- **Role-Based Access Control** (USER/ADMIN permissions)
- **Account Security** with lockout protection (3 failed attempts = 30min lock)
- **Input Validation** with custom sanitization (no external libraries)
- **Security Headers** via Helmet.js (CSP, XSS protection)
- **OWASP Compliance** addressing A01 (Broken Access Control) and A03 (Injection)

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with test accounts
npx prisma db seed

# Start development server
npm run dev
Production Deployment (Render)

Web Service Configuration:

Build Command: npm install && npx prisma generate && npx prisma db push --accept-data-loss
Start Command: npm start
Node Version: 18+


Environment Variables:

env   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_ACCESS_SECRET=your_256_bit_secret_key_here
   JWT_REFRESH_SECRET=different_256_bit_secret_key_here
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   PORT=10000

Create First Admin (Production Only):
After initial deployment, visit:

   POST https://your-backend.onrender.com/api/auth/create-first-admin
This creates the default admin account. Remove this endpoint immediately after use for security!
👤 User Management
Default Admin Credentials (After Seeding)

Email: admin@example.com
Password: Admin123456

⚠️ SECURITY: Change this password immediately after first login in production!
User Registration
Regular users can self-register with USER role:
Endpoint: POST /api/auth/register
Request:
json{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
Response:
json{
  "message": "User registered successfully",
  "user": {
    "id": "cm2o8...",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2025-10-13T..."
  }
}
Creating Additional Admins
Only existing admins can create new admin accounts:
Endpoint: POST /api/auth/create-admin
Request:
json{
  "email": "newadmin@example.com",
  "password": "AdminPassword123"
}
Headers:
Authorization: Bearer <admin_access_token>
Content-Type: application/json
Response:
json{
  "message": "Admin user created successfully",
  "user": {
    "id": "cm2o9...",
    "email": "newadmin@example.com",
    "role": "ADMIN",
    "createdAt": "2025-10-13T..."
  }
}
🔐 Security Implementation
JWT Flow & Token Strategy
Token Types:

Access Token: Short-lived (15min), stored in memory
Refresh Token: Long-lived (7 days), stored in database with rotation

Authentication Flow:

User authenticates with email/password
Server generates access + refresh token pair
Access token used for API requests (Authorization header)
When access token expires, refresh token generates new pair
Refresh tokens are rotated on each use (security best practice)

OWASP Vulnerability Mitigation
A01:2021 - Broken Access Control

JWT Validation: Every protected route validates tokens server-side
Role-Based Permissions: Middleware enforces USER/ADMIN access levels
Resource Ownership: Users can only access their own data
Account Lockout: 3 failed login attempts = 30-minute lockout

A03:2021 - Injection

Custom Input Validation: Email format, password strength, length limits
Data Sanitization: HTML entity encoding for XSS prevention
Parameterized Queries: Prisma ORM prevents SQL injection
Input Length Limits: Prevent buffer overflow attacks

📚 API Documentation
Authentication Endpoints
POST /api/auth/register
Register new user account (USER role only).
Request:
json{
  "email": "user@example.com",
  "password": "Password123"
}
Response:
json{
  "message": "User registered successfully",
  "user": {
    "id": "cm2o8...",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2025-10-13T..."
  }
}
POST /api/auth/login
Authenticate user and receive token pair.
Request:
json{
  "email": "user@example.com",
  "password": "Password123"
}
Response:
json{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cm2o8...",
    "email": "user@example.com",
    "role": "USER"
  }
}
Error Responses:

401: Invalid credentials
423: Account locked (after 3 failed attempts)

POST /api/auth/refresh
Refresh access token using refresh token.
Request:
json{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
Response:
json{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
POST /api/auth/logout
Invalidate refresh token and logout user.
Headers:
Authorization: Bearer <access_token>
Request:
json{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
Response:
json{
  "message": "Logged out successfully"
}
GET /api/auth/me
Get current authenticated user information.
Headers:
Authorization: Bearer <access_token>
Response:
json{
  "user": {
    "id": "cm2o8...",
    "email": "user@example.com",
    "role": "USER"
  }
}
Task Management Endpoints
GET /api/tasks
Access: USER (own tasks), ADMIN (all tasks)
Headers:
Authorization: Bearer <access_token>
Response:
json{
  "tasks": [
    {
      "id": "cm2o9...",
      "title": "Complete project",
      "description": "Finish the API documentation",
      "completed": false,
      "userId": "cm2o8...",
      "createdAt": "2025-10-13T...",
      "updatedAt": "2025-10-13T..."
    }
  ]
}
POST /api/tasks
Access: USER, ADMIN
Headers:
Authorization: Bearer <access_token>
Request:
json{
  "title": "New task",
  "description": "Task description"
}
PUT /api/tasks/:id
Access: Task owner, ADMIN
Headers:
Authorization: Bearer <access_token>
Request:
json{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
DELETE /api/tasks/:id
Access: ADMIN only
Headers:
Authorization: Bearer <access_token>
Response:
json{
  "message": "Task deleted successfully"
}
POST /api/tasks/search
Access: USER (own tasks), ADMIN (all tasks)
Headers:
Authorization: Bearer <access_token>
Request:
json{
  "query": "project"
}
POST /api/tasks/filter
Access: USER (own tasks), ADMIN (all tasks)
Headers:
Authorization: Bearer <access_token>
Request:
json{
  "completed": true
}
🧪 Testing
Test Accounts (After Seeding)
Admin: admin@example.com / Admin123456
User:  user@example.com / User123456
Security Testing Scenarios

Account Lockout Protection

Attempt login with wrong password 3 times
Verify account locks for 30 minutes
Check remaining attempts are shown


Role-Based Access Control

Login as USER
Attempt to delete a task (should fail)
Login as ADMIN
Delete task successfully


Token Expiration & Refresh

Login and save access token
Wait 15+ minutes
Use expired token (should fail)
Use refresh token to get new access token
Verify new token works


Input Validation

Test XSS payloads: <script>alert('xss')</script>
Test SQL injection: ' OR '1'='1
Test long inputs (>1000 characters)
Verify all are sanitized/rejected



🛠️ Tech Stack

Runtime: Node.js 18+
Framework: Express.js
Database: PostgreSQL with Prisma ORM
Authentication: JWT (jsonwebtoken)
Security: bcryptjs, Helmet.js, custom validation
Rate Limiting: express-rate-limit

📂 Project Structure
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.js              # Database seeding
│   └── migrations/          # Database migrations
├── routes/
│   ├── auth.js              # Authentication routes
│   └── tasks.js             # Task management routes
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── validation.js        # Input validation
│   └── rateLimiter.js       # Rate limiting
├── server.js                # Application entry point
└── .env                     # Environment variables
🔒 Security Checklist

 Password hashing with bcrypt (12 rounds)
 JWT token validation on all protected routes
 Role-based access control (RBAC)
 Account lockout after failed attempts
 Input validation and sanitization
 SQL injection prevention (Prisma ORM)
 XSS protection (Helmet + sanitization)
 CORS configuration
 Rate limiting on sensitive endpoints
 Secure HTTP headers (Helmet.js)
 Environment variable management



📄 License
MIT License - See LICENSE file for details.
🤝 Contributing

Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Open a Pull Request

📞 Support
For issues and questions:

GitHub Issues: Create an issue
Documentation: See inline code comments