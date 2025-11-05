# Secure Task Management API

A robust Node.js/Express backend API with JWT authentication, role-based access control (RBAC), and comprehensive security measures to mitigate OWASP vulnerabilities.

## 🚀 Features

- **JWT Authentication & Authorization**: Secure token-based authentication with access/refresh token rotation
- **Role-Based Access Control (RBAC)**: Admin and User roles with granular permissions
- **Account Security**: Password hashing with bcrypt, account lockout after failed attempts
- **Input Validation & Sanitization**: Manual validation to prevent injection attacks
- **Security Headers**: Helmet middleware for enhanced security
- **Token Management**: Refresh token blacklisting and secure token rotation
- **Task Management**: Full CRUD operations with search, filter, and pagination
- **Rate Limiting**: Protection against brute force attacks
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Validation**: Custom validation utilities (no external libraries)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Brave-Bedemptive-Week-3-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/secure-task-manager
   
   # JWT Configuration
   JWT_ACCESS_SECRET=your-super-secret-access-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Security Configuration
   BCRYPT_ROUNDS=12
   MAX_LOGIN_ATTEMPTS=3
   LOCKOUT_TIME=30
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com", // or username
  "password": "securePassword123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Task Endpoints

#### Get All Tasks (with pagination)
```http
GET /api/tasks?page=1&limit=10&status=pending&priority=high
Authorization: Bearer <access_token>
```

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
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-15",
  "tags": ["documentation", "project"],
  "assignedTo": "user_id_here"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "medium"
}
```

#### Delete Task (Admin Only)
```http
DELETE /api/tasks/:id
Authorization: Bearer <access_token>
```

#### Search Tasks
```http
POST /api/tasks/search
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "query": {
    "search": "documentation"
  },
  "filters": {
    "status": "pending",
    "priority": "high"
  },
  "pagination": {
    "page": 1,
    "limit": 10
  }
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
  "tags": ["documentation"],
  "dueDateFrom": "2024-01-01",
  "dueDateTo": "2024-01-31"
}
```

#### Get Task Statistics
```http
GET /api/tasks/stats/overview
Authorization: Bearer <access_token>
```

## 🔐 Security Implementation

### JWT Token Flow & Rotation Strategy

1. **Access Token**: Short-lived (15 minutes), stored in memory on client
2. **Refresh Token**: Long-lived (7 days), stored in HttpOnly cookies
3. **Token Rotation**: New refresh token issued on each refresh
4. **Token Blacklisting**: Refresh tokens can be revoked and blacklisted

### Secure Token Storage Method

**Access Tokens**: Stored in memory (JavaScript variables) to prevent XSS attacks
- ✅ Not accessible via `localStorage` or `sessionStorage`
- ✅ Automatically cleared when browser tab closes
- ✅ Protected from XSS attacks

**Refresh Tokens**: Stored in HttpOnly cookies
- ✅ Not accessible via JavaScript
- ✅ Automatically sent with requests
- ✅ Protected from XSS attacks
- ✅ Can be secured with SameSite and Secure flags

### OWASP Vulnerability Mitigation

#### A01:2021 - Broken Access Control

**Implemented Protections:**
- **Role-Based Access Control (RBAC)**: Users can only access their own tasks, admins can access all
- **Route Protection**: Middleware validates user permissions before route access
- **Task Access Control**: Users cannot access tasks they don't own (unless admin)
- **Admin-Only Operations**: Delete operations restricted to admin role only

**Code Example:**
```javascript
// RBAC Middleware
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// Task Access Control
const authorizeTaskAccess = async (req, res, next) => {
  if (userRole === 'admin') return next();
  
  const task = await Task.findById(taskId);
  if (task.createdBy.toString() !== userId) {
    return res.status(403).json({
      error: 'Access denied. You can only access your own tasks.'
    });
  }
  next();
};
```

#### A03:2021 - Injection

**Implemented Protections:**
- **Manual Input Validation**: Custom validation functions for all inputs
- **Data Sanitization**: HTML entity encoding and control character removal
- **MongoDB Injection Prevention**: Parameterized queries and schema validation
- **NoSQL Injection Protection**: Strict input validation and sanitization

**Code Example:**
```javascript
// Input Sanitization
const sanitizeString = (input, maxLength = 1000) => {
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  sanitized = sanitized.trim();
  
  // Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized;
};

// Email Validation
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  return sanitized;
};
```

### Additional Security Measures

1. **Password Security**:
   - bcrypt hashing with 12 rounds
   - Minimum 8 characters with letter and number requirements
   - Common password detection

2. **Account Lockout**:
   - 3 failed login attempts trigger 30-minute lockout
   - Automatic unlock after timeout
   - Login attempt tracking

3. **Rate Limiting**:
   - 100 requests per 15 minutes per IP
   - 5 authentication attempts per 15 minutes
   - 3 login attempts per 15 minutes

4. **Security Headers**:
   - Helmet middleware for security headers
   - Content Security Policy (CSP)
   - XSS Protection
   - HSTS (in production)

5. **CORS Configuration**:
   - Restricted origins in production
   - Credentials support for cookies
   - Specific allowed methods and headers

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_ACCESS_SECRET=your-production-access-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Database Schema

### User Model
```javascript
{
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed, required)
  role: String (enum: ['user', 'admin'], default: 'user')
  isActive: Boolean (default: true)
  loginAttempts: Number (default: 0)
  lockUntil: Date (default: null)
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required, max: 200)
  description: String (max: 1000)
  status: String (enum: ['pending', 'in-progress', 'completed'])
  priority: String (enum: ['low', 'medium', 'high'])
  dueDate: Date
  createdBy: ObjectId (ref: User)
  assignedTo: ObjectId (ref: User)
  tags: [String]
  isDeleted: Boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

### RefreshToken Model
```javascript
{
  token: String (unique, required)
  userId: ObjectId (ref: User)
  expiresAt: Date (required, TTL index)
  isRevoked: Boolean (default: false)
  userAgent: String
  ipAddress: String
  createdAt: Date
  lastUsedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

## 🔗 Related Resources

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/security/)