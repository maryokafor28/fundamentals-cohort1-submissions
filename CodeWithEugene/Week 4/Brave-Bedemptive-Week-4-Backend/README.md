# DevConnect Backend API

A robust and scalable RESTful API backend for DevConnect, a lightweight developer collaboration platform. Built with modern technologies to facilitate seamless project sharing, user authentication, and community engagement through comments.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19.1-green)](https://www.mongodb.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **User Authentication**: Secure user registration and login with JWT-based authentication
- **Project Management**: Full CRUD operations for developer projects
- **Comment System**: Threaded comments for project discussions
- **User Profiles**: View user profiles and their contributions
- **Protected Routes**: Middleware-based authentication for secure endpoints
- **Type Safety**: Built with TypeScript for enhanced code quality and maintainability
- **RESTful Architecture**: Clean and intuitive API design following REST principles
- **Error Handling**: Comprehensive error handling and validation
- **CORS Enabled**: Cross-Origin Resource Sharing configured for frontend integration

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.9.3
- **Database**: MongoDB with Mongoose ODM 8.19.1
- **Authentication**: JSON Web Tokens (JWT) with bcryptjs for password hashing
- **Development Tools**: 
  - Nodemon for hot-reloading
  - ts-node for TypeScript execution
  - Concurrently for running multiple processes

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher) or **yarn**
- **MongoDB** (v6.x or higher) - Local installation or MongoDB Atlas account
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CodeWithEugene/Brave-Bedemptive-Week-4-Backend.git
   cd Brave-Bedemptive-Week-4-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   or if you prefer yarn:

   ```bash
   yarn install
   ```

## ⚙️ Configuration

1. **Create a `.env` file** in the root directory:

   ```bash
   touch .env
   ```

2. **Add the following environment variables**:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/devconnect
   # Or for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devconnect?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d

   # CORS Configuration (optional)
   CLIENT_URL=http://localhost:3000
   ```

3. **Important**: Replace placeholder values with your actual credentials. Never commit your `.env` file to version control.

## 🏃 Running the Application

### Development Mode

Start the server with hot-reloading:

```bash
npm run dev
```

### Production Mode

Start the server in production:

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register a New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**: `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Project Endpoints

#### Get All Projects

```http
GET /api/projects
```

**Response**: `200 OK`
```json
[
  {
    "_id": "project_id",
    "title": "Awesome Project",
    "description": "A cool developer project",
    "author": "user_id",
    "createdAt": "2025-10-13T10:00:00.000Z"
  }
]
```

#### Get Project by ID

```http
GET /api/projects/:id
```

**Response**: `200 OK`

#### Create a New Project

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Project",
  "description": "Project description here",
  "technologies": ["Node.js", "MongoDB", "Express"],
  "githubUrl": "https://github.com/user/repo"
}
```

**Response**: `201 Created`

#### Update a Project

```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response**: `200 OK`

#### Delete a Project

```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

**Response**: `200 OK`

### Comment Endpoints

#### Get Comments for a Project

```http
GET /api/projects/:projectId/comments
```

**Response**: `200 OK`

#### Add a Comment to a Project

```http
POST /api/projects/:projectId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great project! Love the implementation."
}
```

**Response**: `201 Created`

#### Delete a Comment

```http
DELETE /api/comments/:commentId
Authorization: Bearer <token>
```

**Response**: `200 OK`

### User Profile Endpoints

#### Get User Profile

```http
GET /api/users/:username
```

**Response**: `200 OK`

### Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure

```
Brave-Bedemptive-Week-4-Backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── index.ts         # Environment and app configuration
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts      # Authentication logic
│   │   ├── commentController.ts   # Comment CRUD operations
│   │   └── mainController.ts      # Project and user operations
│   ├── middleware/          # Custom middleware
│   │   └── authMiddleware.ts      # JWT authentication middleware
│   ├── models/              # Database models
│   │   ├── Comment.ts       # Comment schema
│   │   ├── Project.ts       # Project schema
│   │   └── User.ts          # User schema
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts    # Authentication routes
│   │   └── mainRoutes.ts    # Main application routes
│   └── index.ts             # Application entry point
├── .env                     # Environment variables (not in repo)
├── .gitignore              # Git ignore file
├── LICENSE                 # License file
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Write clean, readable, and maintainable code
- Add comments for complex logic
- Ensure all tests pass before submitting PR
- Follow the existing code style and structure

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**CodeWithEugene**

- GitHub: [@CodeWithEugene](https://github.com/CodeWithEugene)

## 🐛 Issues

If you encounter any issues or have suggestions, please file an issue on the [GitHub Issues](https://github.com/CodeWithEugene/Brave-Bedemptive-Week-4-Backend/issues) page.

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Built as part of the Brave Redemptive Week 4 project
- Inspired by modern developer collaboration platforms

---

**Made with ❤️ by CodeWithEugene**
