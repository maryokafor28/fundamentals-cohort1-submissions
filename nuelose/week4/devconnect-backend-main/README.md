# DevConnect Backend

A collaborative developer platform API built with **Node.js**, **Express**, and **MongoDB**.  
DevConnect enables developers to **create projects**, **like and comment**, and **showcase their tech stack** — connecting devs through their work.

---

## 🧰 Tech Stack

- **Node.js** + **Express** — Backend framework
- **MongoDB** + **Mongoose** — Database
- **JWT (jsonwebtoken)** — Authentication
- **Bcrypt.js** — Password hashing
- **Jest** — Unit testing
- **Dotenv** — Environment configuration
- **Cors** — Cross-origin support

---

## 📁 Project Structure

```
devconnect-backend/
│
├── config/
│ └── database.js
│
├── controllers/
│ ├── authController.js
│ ├── userController.js
│ ├── projectController.js
│ └── commentController.js
│
├── middleware/
│ └── auth.js
│
├── models/
│ ├── User.js
│ ├── Project.js
│ └── Comment.js
│
├── routes/
│ ├── authRoute.js
│ ├── userRoute.js
│ ├── projectRoute.js
│ └── commentRoute.js
│
├── tests/
│ ├── auth.test.js
│ ├── project.test.js
│ └── comment.test.js
│
├── .env.example
├── package.json
├── server.js
└── README.md
```

---

## Environment Variables

Create a `.env` file in the root directory and add:

```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

You can use .env.example as a guide.

### Installation & Setup

- Clone the repository

```bash
git clone https://github.com/nuelose/devconnect-backend.git
cd devconnect-backend
```

### Install dependencies

```bash
npm install
```

### Set environment variables

```bash
cp .env.example .env
```

### Run the development server

```bash
npm run dev
```

The server will start at:
`http://localhost:3000`

### API Live Link

Try out the deployed url here:
🔗 [DevConnect-api](https://devconnect-backend-delta.vercel.app)

### API Documentation

Explore the full API documentation and example requests here:
🔗 [View Postman API Docs](https://documenter.getpostman.com/view/49262917/2sB3QQH73V)

### Authentication Flow

Register → /api/auth/register

Login → /api/auth/login

Include the returned token in headers as:

```makefile

Authorization: Bearer <your_token>
```

### Available Endpoints

| **Feature** | **Method** | **Endpoint**                 | **Description**                |
| ----------- | ---------- | ---------------------------- | ------------------------------ |
| Auth        | POST       | `/api/auth/register`         | Register a new user            |
| Auth        | POST       | `/api/auth/login`            | Login user & get token         |
| Users       | GET        | `/api/users/:id`             | Get user profile               |
| Users       | PUT        | `/api/users/:id`             | Update user profile            |
| Projects    | POST       | `/api/projects`              | Create new project             |
| Projects    | GET        | `/api/projects`              | Get all projects               |
| Projects    | GET        | `/api/projects/:id`          | Get single project (populated) |
| Projects    | PUT        | `/api/projects/:id`          | Update own project             |
| Projects    | DELETE     | `/api/projects/:id`          | Delete own project             |
| Likes       | POST       | `/api/projects/:id/like`     | Like or unlike project         |
| Comments    | POST       | `/api/projects/:id/comments` | Add comment                    |
| Comments    | GET        | `/api/projects/:id/comments` | Get all comments               |
| Comments    | DELETE     | `/api/comments/:id`          | Delete own comment             |

### Testing

To run the unit tests:

```bash
npm test
```

All key features (auth, project creation, and comments) are covered with Jest.

Example test output:

<img src="src/images/Screenshot 2025-10-17 at 5.59.11 AM.png" alt="Screenshot of output from running test">

### Coding Standards

Secure authentication and token verification
