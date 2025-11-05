# 🔒 Secure Task Management System

A comprehensive full-stack application demonstrating secure web development practices with JWT authentication, role-based access control (RBAC), and OWASP vulnerability mitigation.

## 🎯 Project Overview

This project implements a secure task management platform with two distinct user roles: **Basic User** and **Admin**. The system showcases modern security practices including secure token handling, input validation, and protection against common web vulnerabilities.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js Backend │    │   MongoDB DB    │
│                 │    │                 │    │                 │
│ • JWT in Memory │◄──►│ • Express API   │◄──►│ • User Data     │
│ • Role-based UI │    │ • JWT Auth      │    │ • Task Data     │
│ • Secure Storage│    │ • RBAC          │    │ • Token Store   │
│ • React Query   │    │ • Input Valid.  │    │ • Audit Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Automated Setup
```bash
# Clone the repository
git clone <repository-url>
cd Brave-Bedemptive-Week-3

# Run the setup script
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Backend Setup**
   ```bash
   cd Brave-Bedemptive-Week-3-Backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd Brave-Bedemptive-Week-3-Frontend
   npm install
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Security Features

### Authentication & Authorization
- **JWT Token System**: Access tokens (15min) + Refresh tokens (7 days)
- **Secure Token Storage**: Access tokens in memory, refresh tokens in HttpOnly cookies
- **Token Rotation**: Automatic refresh token rotation on each use
- **Role-Based Access Control**: Admin and User roles with granular permissions
- **Account Lockout**: 3 failed attempts trigger 30-minute lockout

### OWASP Vulnerability Mitigation

#### A01:2021 - Broken Access Control
- ✅ **RBAC Implementation**: Users can only access their own tasks
- ✅ **Route Protection**: Middleware validates permissions before access
- ✅ **Admin-Only Operations**: Delete operations restricted to admin role
- ✅ **Task Access Control**: Users cannot access tasks they don't own

#### A03:2021 - Injection
- ✅ **Manual Input Validation**: Custom validation functions for all inputs
- ✅ **Data Sanitization**: HTML entity encoding and control character removal
- ✅ **MongoDB Injection Prevention**: Parameterized queries and schema validation
- ✅ **NoSQL Injection Protection**: Strict input validation and sanitization

### Additional Security Measures
- **Password Security**: bcrypt hashing with 12 rounds
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet middleware for enhanced security
- **CORS Configuration**: Restricted origins and methods
- **Error Handling**: No sensitive information in error messages

## 📁 Project Structure

```
Brave-Bedemptive-Week-3/
├── Brave-Bedemptive-Week-3-Backend/     # Node.js/Express API
│   ├── models/                          # MongoDB models
│   ├── routes/                          # API routes
│   ├── middleware/                      # Custom middleware
│   ├── utils/                           # Utility functions
│   └── server.js                        # Main server file
├── Brave-Bedemptive-Week-3-Frontend/    # React/Vite client
│   ├── src/
│   │   ├── components/                  # Reusable components
│   │   ├── pages/                       # Page components
│   │   ├── hooks/                       # Custom hooks
│   │   ├── services/                    # API services
│   │   ├── context/                     # React context
│   │   └── utils/                       # Helper functions
│   └── public/                          # Static assets
└── setup.sh                            # Automated setup script
```

## 🎨 Frontend Features

### User Interface
- **Modern Design**: Clean, responsive interface with Tailwind CSS
- **Role-Based UI**: Different interfaces for Admin and User roles
- **Real-time Updates**: React Query for efficient data fetching
- **Form Validation**: Client-side validation with react-hook-form
- **Toast Notifications**: User feedback with react-hot-toast

### Security Implementation
- **Memory-Based Token Storage**: Access tokens stored in JavaScript variables
- **Automatic Token Refresh**: Seamless token rotation without user intervention
- **XSS Protection**: No sensitive data in localStorage or sessionStorage
- **CSRF Protection**: HttpOnly cookies for refresh tokens

## 🔧 Backend Features

### API Endpoints
- **Authentication**: Register, login, logout, refresh token
- **Task Management**: CRUD operations with search and filtering
- **User Management**: Profile updates and role management
- **Statistics**: Task analytics and system overview

### Database Models
- **User Model**: Authentication, roles, and account security
- **Task Model**: Task data with relationships and validation
- **RefreshToken Model**: Token management and blacklisting

## 🧪 Testing

### Backend Testing
```bash
cd Brave-Bedemptive-Week-3-Backend
npm test
```

### Frontend Testing
```bash
cd Brave-Bedemptive-Week-3-Frontend
npm test
```

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Enable HTTPS
5. Configure CORS for production domains

### Docker Deployment
```bash
# Backend
cd Brave-Bedemptive-Week-3-Backend
docker build -t secure-task-api .
docker run -p 5000:5000 secure-task-api

# Frontend
cd Brave-Bedemptive-Week-3-Frontend
docker build -t secure-task-frontend .
docker run -p 3000:3000 secure-task-frontend
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Task Endpoints
- `GET /api/tasks` - Get all tasks (with pagination)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `POST /api/tasks/search` - Search tasks
- `POST /api/tasks/filter` - Filter tasks
- `GET /api/tasks/stats/overview` - Get task statistics

## 🔍 Security Analysis

### Token Security
- **Access Tokens**: Short-lived (15 minutes), stored in memory
- **Refresh Tokens**: Long-lived (7 days), stored in HttpOnly cookies
- **Token Rotation**: New refresh token issued on each refresh
- **Blacklisting**: Refresh tokens can be revoked and blacklisted

### Input Validation
- **Manual Validation**: Custom validation functions (no external libraries)
- **Sanitization**: HTML entity encoding and control character removal
- **Length Limits**: Maximum length restrictions on all inputs
- **Format Validation**: Email, username, and date format validation

### Access Control
- **Role-Based**: Admin and User roles with different permissions
- **Resource-Based**: Users can only access their own tasks
- **Operation-Based**: Delete operations restricted to admin role
- **Middleware Protection**: All routes protected with authentication middleware

## 📚 Learning Resources

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security Best Practices](https://reactjs.org/docs/security.html)

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

## 🎉 Acknowledgments

This project demonstrates secure web development practices and serves as a learning resource for:
- JWT authentication and authorization
- Role-based access control implementation
- OWASP vulnerability mitigation
- Secure frontend token handling
- Modern full-stack development practices

---

**Built with ❤️ for secure web development education**
