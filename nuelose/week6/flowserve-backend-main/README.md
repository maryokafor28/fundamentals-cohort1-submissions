# FlowServe Backend

A scalable and reliable **FinTech backend API** built with **TypeScript**, **Express.js**, and **Prisma ORM**, designed to handle digital wallet operations such as user management, deposits, withdrawals, and transfers.

---

## Features

- **User Management** — Create, update, fetch, and delete users
- **Transactions API** — Handle deposits, withdrawals, and transfers
- **Pagination** — Paginated results for large datasets
- **Input Validation** — Zod schema-based validation
- **Error Handling** — Centralized and structured API error responses
- **Configuration** — Environment variable–driven setup via `.env`
- **Logging** — Winston + custom request logger
- **Security Middleware** — Helmet, CORS, rate limiting
- **Database Integration** — PostgreSQL via Prisma ORM
- **Developer Tools** — Prisma Studio, TypeScript, and hot-reload dev mode

---

## Tech Stack

| Layer         | Technology         |
| ------------- | ------------------ |
| Language      | TypeScript         |
| Framework     | Express.js         |
| ORM           | Prisma             |
| Database      | PostgreSQL         |
| Validation    | Zod                |
| Logger        | Winston            |
| Rate Limiting | express-rate-limit |
| Security      | Helmet, CORS       |
| Dev Tools     | ts-node-dev        |

---

## Setup & Installation

### 1️ Clone the Repository

```bash
git clone https://github.com/nuelose/flowserve-backend.git
cd flowserve-backend
```

### 2️ Install Dependencies

```bash
npm install
```

### 3️ Set Up Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://<dbname>:<dbpassword>@localhost:5432/<mydb>?schema=public"
PORT=3001
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
NODE_ENV=development
```

Or copy the content of .env.example into your own .env file.

> Adjust `DATABASE_URL` according to your PostgreSQL setup.

### 4️ Generate Prisma Client

```bash
npm run prisma:generate
```

### 5️ Run Database Migrations

```bash
npm run prisma:migrate
```

### 6 Seed the Database (Optional)

```bash
npx ts-node prisma/seed.ts
```

### 7 Start the Development Server

```bash
npm run dev
```

Your server will be running at:

**[http://localhost:3001](http://localhost:3001)**

---

## API Endpoints

**[API Documentation](https://documenter.getpostman.com/view/49262917/2sB3WpQLBY)**

### Health Check

**GET** `/`
Response:

```json
{ "status": "ok", "service": "flowserve-backend" }
```

---

###  User Routes

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/api/v1/users`     | List all users (paginated) |
| GET    | `/api/v1/users/:id` | Get user by ID             |
| POST   | `/api/v1/users`     | Create new user            |
| PATCH  | `/api/v1/users/:id` | Update existing user       |
| DELETE | `/api/v1/users/:id` | Delete user                |

**Sample Create User Request**

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "balance": 1000
}
```

---

### 💳 Transaction Routes

| Method | Endpoint                   | Description                   |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/api/v1/transactions`     | List transactions (paginated) |
| GET    | `/api/v1/transactions/:id` | Get transaction details       |
| POST   | `/api/v1/transactions`     | Create a transaction          |
| PUT    | `/api/v1/transactions/:id` | Update a transaction          |
| DELETE | `/api/v1/transactions/:id` | Delete a transaction          |

**Sample Deposit Request**

```json
{
  "type": "DEPOSIT",
  "amount": 500,
  "description": "Initial deposit",
  "userEmail": "alice@example.com"
}
```

**Sample Transfer Request**

```json
{
  "type": "TRANSFER",
  "amount": 250,
  "description": "Payment for groceries",
  "senderEmail": "alice@example.com",
  "receiverEmail": "bob@example.com"
}
```

---

## Error Handling

All errors are returned in a structured format:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [{ "field": "email", "message": "Invalid email format" }]
}
```

---

## Logging

Logs are handled via **Winston**, with different levels depending on environment.

Each request is also logged with:

- Method and URL
- Request body, params, and query

Example log output:

```
2025-10-31T21:00:05.202Z [info] Incoming Request: POST /api/v1/transactions {"body":{"type":"DEPOSIT","amount":500}}
```

---

## Rate Limiting

Configured via environment variables:

- `RATE_LIMIT_WINDOW_MS`: 60000 (1 minute)
- `RATE_LIMIT_MAX`: 100 requests per window

If exceeded, API returns:

```json
{ "error": "Too many requests, please try again later." }
```

---

## Developer Commands

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| `npm run dev`             | Run dev server with hot reload |
| `npm run build`           | Compile TypeScript to JS       |
| `npm start`               | Start built JS server          |
| `npm run prisma:generate` | Generate Prisma client         |
| `npm run prisma:migrate`  | Run DB migrations              |
| `npm run prisma:studio`   | Launch Prisma Studio           |

## Author

**FlowServe Engineering Team**
Developed by _Emmanuel_
