# DevConnect Backend API

A RESTful API backend for DevConnect - A developer collaboration platform where developers can share projects, collaborate, and connect.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Express Mongo Sanitize
- **Validation**: Zod
- **Testing**: Jest & Supertest
- **Rate Limiting**: Express Rate Limit

## 📋 Features

- ✅ User authentication (signup, login, logout)
- ✅ JWT-based authorization
- ✅ Project CRUD operations
- ✅ Comment system on projects
- ✅ User profiles
- ✅ Pagination support
- ✅ Search functionality
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling
- ✅ Security best practices

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 📦 Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd devconnect-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CORS_ORIGIN=http://localhost:5173
```

4. **Start the server**

Development mode with hot reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:5000`

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with verbose output:

```bash
npm run test:verbose
```

### Test Coverage

The project includes comprehensive test coverage for:

- Authentication endpoints (signup, login, logout, get user)
- Project CRUD operations
- Comment functionality
- Authorization checks
- Error handling

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### 2. Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 4. Logout User

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Project Endpoints

#### 1. Get All Projects

```http
GET /api/projects?page=1&limit=20&status=in-progress&search=react
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (idea, in-progress, completed)
- `search` (optional): Search in title and description

#### 2. Get Single Project

```http
GET /api/projects/:id
```

#### 3. Create Project

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Awesome Project",
  "description": "A detailed description of the project",
  "techStack": ["React", "Node.js", "MongoDB"],
  "githubUrl": "https://github.com/user/project",
  "liveUrl": "https://myproject.com",
  "status": "in-progress",
  "lookingForCollaborators": true
}
```

#### 4. Update Project

```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "completed"
}
```

#### 5. Delete Project

```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### Comment Endpoints

#### 1. Get Project Comments

```http
GET /api/projects/:id/comments?page=1&limit=20
```

#### 2. Add Comment

```http
POST /api/projects/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great project! I'd love to collaborate."
}
```

#### 3. Delete Comment

```http
DELETE /api/projects/:projectId/comments/:commentId
Authorization: Bearer <token>
```

### User Endpoints

#### 1. Get User Profile

```http
GET /api/users/:id
```

#### 2. Update Own Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "Full-stack developer passionate about open source",
  "skills": ["JavaScript", "React", "Node.js"],
  "githubUrl": "https://github.com/username",
  "linkedinUrl": "https://linkedin.com/in/username"
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login or signup, you'll receive a token that must be included in the Authorization header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are also set as HTTP-only cookies for additional security.

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configured for specific origins
- **Rate Limiting**: Prevents abuse
  - General API: 100 requests per 15 minutes
  - Auth routes: 5 attempts per 15 minutes
  - Create operations: 10 per hour
- **Input Sanitization**: MongoDB injection prevention
- **Password Hashing**: Bcrypt with salt rounds
- **JWT Expiration**: Tokens expire after 7 days

## 📁 Project Structure

```
devconnect-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── projectController.js  # Project & comment logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorHandler.js       # Global error handler
│   │   ├── rateLimiter.js        # Rate limiting config
│   │   └── validator.js          # Zod validation schemas
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Project.js            # Project schema
│   │   └── Comment.js            # Comment schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── projectRoutes.js      # Project endpoints
│   │   └── userRoutes.js         # User endpoints
│   ├── utils/
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   └── jwt.js                # JWT utilities
│   └── app.js                    # App entry point
├── test/
│   ├── setup.js                  # Test configuration
│   └── complete.test.js          # All API tests
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Create account** on Render or Railway
2. **Connect repository**
3. **Set environment variables**:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_production_db`
   - `JWT_SECRET=your_secret`
   - `CORS_ORIGIN=your_frontend_url`
4. **Deploy**

### MongoDB Atlas Setup

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (or allow all: 0.0.0.0/0)
4. Get connection string
5. Replace `<password>` in connection string

## 📊 Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  bio: String,
  skills: [String],
  githubUrl: String,
  linkedinUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model

```javascript
{
  title: String (required),
  description: String (required),
  techStack: [String],
  githubUrl: String,
  liveUrl: String,
  author: ObjectId (ref: User),
  status: String (enum: ['idea', 'in-progress', 'completed']),
  lookingForCollaborators: Boolean,
  collaborators: [ObjectId (ref: User)],
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

```javascript
{
  content: String (required),
  author: ObjectId (ref: User),
  project: ObjectId (ref: Project),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Error Handling

The API uses consistent error responses:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB documentation
- JWT.io
- Jest documentation

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Live API**: [Your deployed API URL]

**Postman Documentation**: [Your Postman collection link]

**Frontend Repository**: [Your frontend repo link]
