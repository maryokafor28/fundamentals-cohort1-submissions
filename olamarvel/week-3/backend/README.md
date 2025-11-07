# 🔒 Secure Task Management API (Week 3 SE Challenge)

## 🚀 Overview

This project is a **secure, role-based Task Management API** built with **Node.js (Express)** and **MongoDB**, implementing:

* **JWT Authentication**
* **Role-Based Access Control (RBAC)**
* **Refresh Token Rotation**
* **Account Lockout on Failed Logins**
* **Input Validation and Data Sanitization**
* **OWASP A01 (Broken Access Control)** and **A03 (Injection)** mitigations.

The backend works hand-in-hand with the **React-Vite frontend client** in this project to demonstrate end-to-end secure API usage.

---

## 🧩 Features

| Feature                              | Description                                                               |
| ------------------------------------ | ------------------------------------------------------------------------- |
| **JWT Authentication**               | Uses Access & Refresh tokens with rotation and expiry.                    |
| **RBAC (Role-Based Access Control)** | Two roles: `user` and `admin`. Each role has different route permissions. |
| **Account Lockout Policy**           | Users get locked for **30 minutes** after 3 failed login attempts.        |
| **Secure Logout & Token Revocation** | Refresh tokens are blacklisted on logout.                                 |
| **Data Validation**                  | All inputs (auth + tasks) are sanitized manually (no external validator). |
| **Helmet Integration**               | Adds secure HTTP headers for protection against common web exploits.      |
| **Search & Filter API**              | Supports paginated search and filtering by task attributes.               |
| **MongoDB Integration**              | Stores users, tasks, and token blacklists securely.                       |
| **Comprehensive Tests**              | Jest-based test coverage for authentication and task routes.              |

---

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── taskController.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   └── roleMiddleware.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Task.ts
│   │   └── TokenBlacklist.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── taskRoutes.ts
│   ├── utils/
│   │   └── sanitizer.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── auth.test.ts
│   ├── tasks.test.ts
│   └── setup.ts
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/secure-task-api.git
cd secure-task-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/secure_task_api
ACCESS_TOKEN_SECRET=supersecretaccesstoken
REFRESH_TOKEN_SECRET=supersecretrefreshtoken
TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
LOCK_DURATION_MINUTES=30
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Server runs on **[http://localhost:5000](http://localhost:5000)**

---

## 🧪 Testing

To run all tests:

```bash
npm test
```

Tests include:

* ✅ User Registration & Login
* ✅ Account Lockout
* ✅ JWT Authorization
* ✅ Role-Based Access Control
* ✅ Task CRUD

---

## 🧠 API Documentation

### **Authentication Routes**

| Endpoint             | Method | Access        | Description                                        |
| -------------------- | ------ | ------------- | -------------------------------------------------- |
| `/api/auth/register` | POST   | Public        | Register a new user                                |
| `/api/auth/login`    | POST   | Public        | Login user, receive access & refresh tokens        |
| `/api/auth/refresh`  | GET    | Public        | Issue a new access token from refresh token cookie |
| `/api/auth/logout`   | GET    | Authenticated | Blacklist refresh token and logout user            |

**Example Request (Login):**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

---

### **Task Routes**

| Endpoint            | Method | Role        | Description               |
| ------------------- | ------ | ----------- | ------------------------- |
| `/api/tasks`        | GET    | user, admin | Get all tasks (paginated) |
| `/api/tasks`        | POST   | user, admin | Create a new task         |
| `/api/tasks/:id`    | DELETE | admin only  | Delete a task             |
| `/api/tasks/search` | POST   | user, admin | Search user’s tasks       |
| `/api/tasks/filter` | POST   | user, admin | Filter user’s tasks       |

**Example (Create Task):**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","description":"testing"}'
```

---

## 🔐 Security Mechanisms

### 🧾 1. JWT Authentication

* **Access Token** (short-lived): Used for protected API calls.
* **Refresh Token** (long-lived): Stored as an **HttpOnly cookie**, renewed periodically.
* **Rotation:** Refresh tokens are rotated on use — previous tokens are blacklisted.

### 🧩 2. Role-Based Access Control (RBAC)

Middleware checks the decoded JWT for user roles:

```js
// Example
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteTask);
```

### 🔄 3. Account Lockout

After 3 consecutive failed login attempts, a user is **locked for 30 minutes**.
Automatic unlock occurs after the lock period expires.

### 🧼 4. Input Validation & Sanitization

All inputs are validated **without external libraries**:

* Length, format, and character whitelisting enforced manually.
* Disallowed characters are stripped from user input.
* Prevents injection attacks (e.g., NoSQL/JSON injection).

Example:

```js
export const sanitizeText = (text) =>
  text.replace(/[^a-zA-Z0-9\s.,!?_-]/g, "").trim();
```

### 🪖 5. Helmet Security Headers

Enabled in `app.ts`:

```js
import helmet from "helmet";
app.use(helmet());
```

Mitigates:

* XSS
* Clickjacking
* MIME sniffing
* CSP enforcement

### 🧱 6. Broken Access Control Prevention

* Every protected route verifies **JWT + role**.
* Backend **rejects unauthorized actions** even if frontend UI is manipulated.
* Example: A normal user cannot DELETE tasks even if they try via Postman.

---

## ⚙️ Token Flow Diagram

```text
 [Client]
    │
    │ Login (POST /auth/login)
    ▼
 [Server]
   → issues Access Token (short-lived)
   → sets Refresh Token (HttpOnly cookie)
    │
    ▼
 [Client] (memory)
   uses Access Token in headers for API calls
    │
    │ (when expired)
    ▼
 [Server]
   GET /auth/refresh (cookie auto-sent)
   → validates refresh token
   → returns new access token
```

---

## 🧰 Tools Used

| Tool                   | Purpose                    |
| ---------------------- | -------------------------- |
| **Node.js (Express)**  | API framework              |
| **MongoDB + Mongoose** | Data persistence           |
| **bcrypt**             | Password hashing           |
| **jsonwebtoken**       | Token generation           |
| **helmet**             | HTTP header security       |
| **dotenv**             | Environment config         |
| **jest / supertest**   | Unit & integration testing |

---

## 🧍‍♂️ Roles & Permissions Summary

| Action              | User | Admin |
| ------------------- | ---- | ----- |
| Register            | ✅    | ✅     |
| Login               | ✅    | ✅     |
| Create Task         | ✅    | ✅     |
| View Tasks          | ✅    | ✅     |
| Delete Task         | ❌    | ✅     |
| Search/Filter Tasks | ✅    | ✅     |

---

## 🧩 OWASP Mitigation Summary

| OWASP Code   | Vulnerability                  | Mitigation                                           |
| ------------ | ------------------------------ | ---------------------------------------------------- |
| **A01:2021** | Broken Access Control          | Role-based middleware + JWT verification per route   |
| **A03:2021** | Injection                      | Manual sanitization and whitelisting of input fields |
| **A05:2021** | Security Misconfiguration      | Helmet + environment isolation                       |
| **A07:2021** | Identification & Auth Failures | Token expiration, blacklist, account lockout         |

---

## 🌐 Related Repositories

* **Frontend (React-Vite)** → [https://github.com/yourusername/secure-task-client](https://github.com/yourusername/secure-task-client)

---

## 🧾 License

This project is released under the **MIT License**.

