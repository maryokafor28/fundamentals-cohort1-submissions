# 🧩 Challenge Week 3 — Task Management Platform (TypeScript API)

---

## 📘 **Project Overview**

The **Task Management Platform API** is a minimalist backend system designed to demonstrate mastery of key backend engineering concepts, including **authentication, authorization, logging, and security best practices** — all implemented with **TypeScript, Express.js, and MongoDB**.

The project follows a structured learning path:

1. Building core server setup and folder structure
2. Implementing authentication (login, logout, refresh)
3. Enforcing account lockouts and token-based access
4. Protecting task routes with RBAC
5. Integrating centralized logging for visibility and debugging

---

## ⚙️ **Tech Stack**

| Category  | Tool                            |
| --------- | ------------------------------- |
| Language  | TypeScript                      |
| Framework | Express.js                      |
| Database  | MongoDB (Mongoose ODM)          |
| Auth      | JWT (Access + Refresh tokens)   |
| Security  | bcryptjs, cookie-parser, dotenv |
| Logging   | Winston + Daily Rotate File     |
| Dev Tools | Nodemon, TS-Node                |

---

## 🧱 **Folder Structure**

```
task-management/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── taskController.ts
│   ├── middleware/
│   │   ├── verifyAccessToken.ts
│   │   └── requireRole.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Task.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── task.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── requestLogger.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── services/
│   │   └── db.ts
│   └── index.ts
├── logs/
│   ├── requests-YYYY-MM-DD.log
│   ├── security.log
│   ├── error.log
│   └── ...
├── .env
├── .env.template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 **Authentication & Security**

### Features Implemented

- **Login / Logout / Refresh Token** flow
- **Account Lockout** after 3 failed logins (auto-unlocks after 30 minutes)
- **Access Token (15 min)** for route protection
- **Refresh Token (7 days)** for session persistence
- **JWT-based role management (user/admin)**
- **Cookie-based refresh token storage (HttpOnly)**

### Access Control Summary

| Route                | Access    | Description          |
| -------------------- | --------- | -------------------- |
| `/api/auth/register` | Public    | Create user          |
| `/api/auth/login`    | Public    | Login and get tokens |
| `/api/auth/refresh`  | Public    | Renew access token   |
| `/api/auth/logout`   | Public    | Invalidate session   |
| `/api/tasks`         | Protected | Manage user’s tasks  |
| `/api/tasks/:id`     | Protected | Delete specific task |

---

## 📜 **Logging & Monitoring**

Logging is implemented with **Winston** and **Daily Rotate File** for complete visibility across the system:

| Log File       | Purpose                            | Example Event             |
| -------------- | ---------------------------------- | ------------------------- |
| `requests.log` | Tracks all HTTP requests           | `GET /api/tasks → 200`    |
| `security.log` | Records auth & token activity      | `LOGIN_FAIL_INVALID_CRED` |
| `error.log`    | Captures system and runtime errors | `DB_CONNECT_FAIL`         |

**Logging levels:**

- `info` → successful actions
- `warn` → invalid actions / security concerns
- `error` → exceptions / failed operations

Each log entry includes timestamps and context like user ID or IP address.

---

## 🧩 **Example Workflows**

### 1️⃣ Login → Get Access Token

```http
POST /api/auth/login
{
  "email": "favour@example.com",
  "password": "mypassword"
}
```

Response:

```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "66ffb1...",
    "name": "Favour",
    "email": "favour@example.com",
    "role": "user"
  }
}
```

---

### 2️⃣ Access Protected Route

```http
GET /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

Response:

```json
[]
```

---

### 3️⃣ Account Lockout Example

After 3 failed logins:

```json
{
  "message": "Account locked for 30 minutes due to multiple failed attempts."
}
```

---

## 🧠 **Learning Outcomes**

Through this project, the following concepts were **implemented and understood deeply**:

- ✅ Secure JWT Authentication
- ✅ Password Hashing & Validation
- ✅ Role-Based Access Control
- ✅ Logging Architecture (Request, Security, Error)
- ✅ Account Lockout & Recovery
- ✅ TypeScript Best Practices & Typing Enhancements

---

## 🧾 **How to Run the Project**

### Step 1 — Install Dependencies

```bash
npm install
```

### Step 2 — Configure Environment

Create a `.env` file from `.env.template`:

```bash
cp .env.template .env
```

Fill in your MongoDB connection and secrets.

### Step 3 — Start the Server

```bash
npm run dev
```

Server starts at:  
📡 `http://localhost:4000`

---

## 🏁 **Conclusion**

This project demonstrates a practical, production-level approach to building **secure and observable backend APIs** using TypeScript.

From **authentication to authorization, logging to security hardening**, every step was intentional — combining software engineering best practices with clarity and maintainability.

# Frontend link

https://github.com/Favourof/task-management-frontend.git
