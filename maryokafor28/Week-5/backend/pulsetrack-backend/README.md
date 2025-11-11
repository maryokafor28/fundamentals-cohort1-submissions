# PulseTrack Backend API

A comprehensive healthcare management system backend built with Node.js, Express, TypeScript, and MongoDB.

## Live Demo

**API Base URL**: [https://pulsetrack-backend-4pc4.onrender.com/api](https://pulsetrack-backend-4pc4.onrender.com/api)

## 📚 API Documentation

**Postman Collection**: [View API Documentation](https://documenter.getpostman.com/view/48798242/2sB3Wjz4Ce)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## ✨ Features

- 🔐 User authentication (Sign up, Sign in, Logout)
- 👥 User management (CRUD operations)
- 🩺 Doctor management
- 📅 Appointment scheduling
- 🔒 Role-based access control (User & Doctor roles)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/maryokafor28/pulsetrack-backend.git
   cd pulsetrack-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pulsetrack
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsetrack

   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Production Mode

```bash
npm start
```

## Project Structure

```
pulsetrack-backend/
├── src/
│   ├── config/
│   │   └── db.ts              # Database connection
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── doctorController.ts
│   │   ├── appointmentController.ts
│   ├── middleware/
│   │   ├── auth.ts            # Authentication middleware
│   │   └── role.ts            # Role-based access control
│   ├── models/
│   │   ├── User.ts
│   │   ├── Doctor.ts
│   │   ├── Appointment.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── doctorRoutes.ts
│   │   ├── appointmentRoutes.ts
│   ├── utils/
│   │   └── generateToken.ts
│   └── server.ts              # Entry point
├── dist/                      # Compiled JavaScript (generated)
├── .env                       # Environment variables (create this)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments

- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## 🧪 Testing with Postman

1. Import the [Postman Collection](https://documenter.getpostman.com/view/48798242/2sB3Wjz4Ce)
2. Set the base URL to `https://pulsetrack-backend-4pc4.onrender.com/api` (production) or `http://localhost:5000/api` (local)
3. Start with authentication endpoints (signup → signin)
4. The token will be automatically saved for subsequent requests

## 🔒 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## CORS Configuration

The API allows requests from:

- `http://localhost:3000`
- `http://localhost:5173`
- `https://pulsetrack-frontend-drab.vercel.app`

To add more origins, update the CORS configuration in `src/server.ts`.

## 📦 Available Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript         |
| `npm start`     | Run production server                    |
| `npm test`      | Run tests (not configured yet)           |

## 🚢 Deployment

This project is configured for deployment on [Render](https://render.com/).

### Deploy to Render

1. Push your code to GitHub
2. Connect your repository to Render
3. Add environment variables in Render dashboard
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`

### Environment Variables for Production

Make sure to set these in your hosting platform:

```env
PORT=5000
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_secret_key>
NODE_ENV=production
```

## 👤 Author

**Mary Amadi**

## Issues

If you encounter any issues, please [create an issue](https://github.com/maryokafor28/pulsetrack-backend/issues) on GitHub.

---
