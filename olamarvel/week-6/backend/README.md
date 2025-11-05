🏦 FlowServe Backend API

Overview

FlowServe is a scalable fintech backend service designed for real-time transaction processing and digital wallet operations. It provides APIs for user authentication, fund management, and transaction simulation, built with Node.js, Express, and PostgreSQL.

This project focuses on scalability, modularity, and fault tolerance, aligning with modern API best practices.

🚀 Features

User registration, login, and session management with JWT

Token-based authentication with refresh token rotation

Secure password hashing using bcrypt

Role-based access and token validation middleware

Deposit, transfer, and transaction statement endpoints

Pagination, rate limiting, and input validation (Zod)

Logging with Winston/Pino for performance tracking

PostgreSQL database with Sequelize/Prisma ORM

Comprehensive Postman documentation


🧱 Tech Stack

Category	Technology

Runtime	Node.js (v18+)
Framework	Express.js
Database	PostgreSQL
ORM	Sequelize / Prisma
Validation	Zod
Logging	Winston / Pino
Rate Limiting	express-rate-limit
Token Management	JWT + Refresh Tokens
API Documentation	Postman
Environment Config	dotenv


⚙️ Project Structure

flowserve-backend/
├── src/
│   ├── config/          # Environment, DB config
│   ├── controllers/     # Route controllers (Auth, Transactions)
│   ├── middlewares/     # Error handling, validation, auth
│   ├── models/          # ORM models (User, Transaction, RefreshToken)
│   ├── routes/          # Modular API routes
│   ├── utils/           # Helpers (logger, tokens, etc.)
│   ├── app.js           # Express app setup
│   └── server.js        # App entry point
├── prisma/ or migrations/
├── .env
├── package.json
└── README.md

🧰 Setup and Installation

1. Clone the repository

git clone https://github.com/<your-username>/flowserve-backend.git
cd flowserve-backend

2. Install dependencies

npm install

3. Configure environment variables

Create a .env file at the root and add:

PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/flowserve
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
RATE_LIMIT_WINDOW=15 * 60 * 1000
RATE_LIMIT_MAX=100

4. Run migrations (for Sequelize)

npx sequelize db:migrate

Or for Prisma:

npx prisma migrate dev

5. Start the server

npm run dev

Server runs at:

http://localhost:5000

📡 API Documentation

Full API collection is available in Postman:
Collection Name: FlowServe API
You can import it directly via JSON or Postman share link.

Set the following environment variables in Postman:

baseUrl → http://localhost:5000

authToken → (automatically set after login)


🔑 Authentication Routes

Method	Endpoint	Description

POST	/api/auth/register	Register a new user
POST	/api/auth/login	Log in and get access + refresh tokens
GET	/api/auth/getUser	Get profile details of current user
POST	/api/auth/refresh	Refresh expired access token
POST	/api/auth/logout	Log out and invalidate refresh token


Sample Request (Register):

POST /api/auth/register
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "aStrongPassword123"
}

💸 Transaction Routes

Method	Endpoint	Description

GET	/api/transactions/balance	Get user wallet balance
POST	/api/transactions/deposit	Deposit funds
POST	/api/transactions/send	Transfer funds to another user
GET	/api/transactions/statement?page=1&pagesize=10	Get paginated transaction history


Sample Request (Send Funds):

POST /api/transactions/send
{
  "recipientEmail": "receiver@example.com",
  "amount": 50
}

Response Example:

{
  "success": true,
  "message": "Funds transferred successfully",
  "data": {
    "senderBalance": 450,
    "recipientBalance": 150
  }
}

🧩 Validation Rules (Zod)

Auth

email: string, valid email

password: string, 8–20 chars

name: string, required


Transaction

amount: number, positive

recipientEmail: string, valid email


🛡️ Error Handling

Standardized JSON error responses:

{
  "success": false,
  "message": "Invalid email or password",
  "error": "AUTH_ERROR"
}

Custom middleware handles:

Validation errors

JWT/Authentication errors

Database and internal errors


📊 Logging and Monitoring

All requests and performance data are logged using Winston/Pino with timestamps and levels:

[2025-10-31 12:15:02] INFO: POST /api/auth/login - 200 OK

⚡ Rate Limiting

Configured via express-rate-limit

Default: 100 requests per 15 minutes per IP


🧪 Testing

You can use:

npm test

or directly run Postman’s built-in collection runner for integration testing.

🌐 Deployment (Optional)

Supported platforms:

Render - https://render.com

Railway - https://railway.app

Vercel - https://vercel.com


Make sure to set environment variables properly in your hosting dashboard.

👨‍💻 Author

Marvelous Anthony Olatunde
Part of Software Engineering Week 6 Challenge - FlowServe Project
