# 🌊 **FlowServe Backend API – v1**

A secure, versioned REST API built with **Express.js**, **PostgreSQL**, and **Prisma ORM**.  
Includes clean architecture, validation, HATEOAS links, structured error handling, and transaction logic.

---

## ⚙️ **Project Overview**

| Feature                 | Description                            |
| ----------------------- | -------------------------------------- |
| **Database**            | PostgreSQL (via Prisma ORM)            |
| **Architecture**        | Modular MVC + Service Layer            |
| **Security**            | Helmet, Rate Limiting                  |
| **Validation**          | Joi with unified response format       |
| **Error Handling**      | Global AppError + Prisma-aware handler |
| **HATEOAS**             | Added for all resource responses       |
| **Environment Support** | `.env` (dev) / `.env.prod` (prod)      |
| **API Versioning**      | `/api/v1/...`                          |

---

## 🏗️ **Tech Stack**

- Node.js / Express.js
- Prisma ORM (PostgreSQL)
- Joi (Validation)
- Helmet, Rate Limiting, Cookie Parser
- CORS
- XSS / CSRF (config-ready)
- Morgan & Winston (Logging)

---

## 🚀 **Setup Instructions**

### 1️⃣ Clone and Install

```bash
git clone https://github.com/yourusername/flowserve-backend.git
cd flowserve-backend
npm install
```

### 2️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```bash
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/flowserve_dev"
PORT=4000
NODE_ENV=development
```

_(For production, use `.env.prod` with your Render DB credentials.)_

---

### 3️⃣ Run Database Migration

```bash
npx prisma migrate dev --name init
```

---

### 4️⃣ Start the Server

```bash
npm run dev
```

Server runs by default on:  
👉 `http://localhost:4000`

---

## 🧭 **Base URL**

| Environment | URL                                         |
| ----------- | ------------------------------------------- |
| Development | `http://localhost:4000/api/v1`              |
| Production  | `https://your-production-domain.com/api/v1` |

---

## 👤 **User Endpoints**

### ➕ Create User

`POST /users`

**Request Body:**

```json
{
  "name": "Ada Lovelace",
  "email": "ada@flowserve.com",
  "balance": 5000
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@flowserve.com",
    "balance": 5000,
    "links": [
      { "rel": "self", "method": "GET", "href": "/api/v1/users/1" },
      { "rel": "update", "method": "PATCH", "href": "/api/v1/users/1" },
      { "rel": "delete", "method": "DELETE", "href": "/api/v1/users/1" }
    ]
  }
}
```

---

### 📄 Get All Users

`GET /users?page=1&limit=10`

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "id": 1,
      "name": "Ada Lovelace",
      "email": "ada@flowserve.com",
      "balance": 5000
    },
    {
      "id": 2,
      "name": "Alan Turing",
      "email": "turing@flowserve.com",
      "balance": 2000
    }
  ]
}
```

---

### 🔍 Get Single User

`GET /users/:id`

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@flowserve.com",
    "balance": 5000
  }
}
```

---

### 🧾 Update User

`PATCH /users/:id`

**Request Body:**

```json
{
  "balance": 7000
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@flowserve.com",
    "balance": 7000
  }
}
```

---

### ❌ Delete User

`DELETE /users/:id`

**Response (204):**

```
<empty body>
```

---

## 💳 **Transaction Endpoints**

### ➕ Create Transaction

`POST /transactions`

**Request Body:**

```json
{
  "userId": 1,
  "type": "credit",
  "amount": 1000,
  "description": "Initial deposit"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "type": "credit",
    "amount": 1000,
    "description": "Initial deposit",
    "userId": 1,
    "links": [
      { "rel": "self", "method": "GET", "href": "/api/v1/transactions/1" }
    ]
  }
}
```

---

### 📄 Get All Transactions

`GET /transactions`

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "id": 1,
      "type": "credit",
      "amount": 1000,
      "description": "Initial deposit",
      "user": { "id": 1, "name": "Ada Lovelace", "email": "ada@flowserve.com" }
    },
    {
      "id": 2,
      "type": "debit",
      "amount": 300,
      "description": "Withdrawal",
      "user": { "id": 1, "name": "Ada Lovelace", "email": "ada@flowserve.com" }
    }
  ]
}
```

---

### 🔍 Get Single Transaction

`GET /transactions/:id`

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "type": "credit",
    "amount": 1000,
    "description": "Initial deposit",
    "user": { "id": 1, "name": "Ada Lovelace", "email": "ada@flowserve.com" }
  }
}
```

---

## 🧠 **System Routes**

### API Health Check

`GET /`

**Response:**

```json
{
  "message": "FlowServe API v1 running..."
}
```

---

## 🚨 **Error Response Structure**

All errors follow this format:

```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    { "field": "amount", "message": "Minimum transaction amount is ₦100" }
  ]
}
```

| Code | Meaning                           |
| ---- | --------------------------------- |
| 400  | Bad request or validation failure |
| 401  | Unauthorized                      |
| 404  | Record not found                  |
| 429  | Too many requests                 |
| 500  | Internal server error             |

---

## 🔒 **Security Overview**

| Feature       | Status        | Description                        |
| ------------- | ------------- | ---------------------------------- |
| Helmet        | ✅ Enabled    | Adds secure HTTP headers           |
| Rate Limiting | ✅ Enabled    | Limits repeated requests per IP    |
| CORS          | ✅ Configured | Allows specific origins only       |
| XSS Sanitizer | ⚙️ Ready      | Temporarily disabled for testing   |
| CSRF          | ⚙️ Ready      | Cookie-based, temporarily disabled |
| Cookie Parser | ✅ Enabled    | Used for CSRF token parsing        |

---

## 🧩 **Project Structure**

```
flowserve-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validations/
├── .env
├── package.json
└── README.md
```

---

## 🧪 **Testing**

You can test all endpoints using **Postman**.

1. Create a collection called `FlowServe API v1`.
2. Add the endpoints from this README.
3. Use the base URL:
   - `{{base_url}} = https://flowserve-bankend.onrender.com/api/v1`

## server url

(https://flowserve-bankend.onrender.com/)
