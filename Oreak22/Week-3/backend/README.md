# Secure Multi-Role Task Management API

> A minimalist Node.js + React/Vite application with JWT authentication, token rotation, and Role-Based Access Control (RBAC).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [JWT Authentication Flow](#jwt-authentication-flow)
- [Token Rotation Strategy](#token-rotation-strategy)
- [Secure Token Storage](#secure-token-storage)
- [API Routes Summary](#api-routes-summary)
- [Role Access Matrix](#role-access-matrix)

---

## Overview

This project implements a **secure Task Management Platform** where users can register, log in, and manage their tasks.\
It includes **Role-Based Access Control (RBAC)** with two roles:

- **Basic User:** Can create, view, and search their own tasks.
- **Admin:** Can view and delete any user’s tasks.

The focus is on **security**, **JWT-based authentication**, and **mitigation of common vulnerabilities** (Broken Access Control and Injection).

---

## Tech Stack

| Component      | Technology                                        |
| -------------- | ------------------------------------------------- |
| Backend        | Node.js + Express                                 |
| Frontend       | React + Vite                                      |
| Database       | MongoDB (Mongoose)                                |
| Authentication | JSON Web Token (JWT)                              |
| Security       | Helmet, bcrypt, express-rate-limit, cookie-parser |

---

## Features

- Secure JWT Authentication (Access + Refresh Tokens)
- Role-Based Access Control (RBAC)
- Input Validation
- Account Lockout after 3 failed logins (auto unlock after 30 minutes)
- Token Blacklisting on Logout
- Search and Filter endpoints
- Secure HTTP headers via Helmet
- Frontend token in-memory handling with silent refresh

---

## Architecture

```
project-root/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── config/
│   │   └── types/
│   └── .env
└── frontend/
    ├── src/
    ├── vite.config.js
    ├── package.json
    └── .env
```

---

## Setup & Installation

### Backend Setup

```bash
# 1. Clone repository
git clone https://github.com/Oreak22/brave-task-server.git

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env

# 4. Run development server
npm run dev
```

**Example \*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***`.env`**\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\*** file:\*\*

```env
PORT=4000
MONGO_URI=
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CORS_ORIGIN= http://localhost:5173
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
LOCKED_UNTIL = 30 * 60 * 1000
BCRYPT_SALT = 10
```

---

### Frontend Setup

```bash
#  1. Clone repository
git clone https://github.com/Oreak22/brave-task.git

# 2. Install dependencies
npm install

# 3. Set API URL in .env
VITE_SERVER_PORT=http://localhost:4000/api"

# 4. Run development server
npm run dev
```

---

## JWT Authentication Flow

The application uses a **two-token strategy**:

1. **Access Token**

   - Short-lived (\~15 minutes)
   - Used for accessing protected routes.
   - Stored **in memory** (not localStorage or cookies).

2. **Refresh Token**

   - Long-lived (\~7 days)
   - Stored securely as an **HttpOnly cookie**.
   - Used only to get new access tokens via `/api/auth/refresh`.

### Flow Diagram

```text
[User Login] → Server verifies credentials
       ↓
Server issues:
   - Access Token (15 min)
   - Refresh Token (7 days, HttpOnly cookie)
       ↓
Client stores Access Token in memory
       ↓
Each protected request includes Access Token (Authorization header)
       ↓
If token expires → auto-refresh using Refresh Token → retry request
```

---

## Token Rotation Strategy

- Every successful call to `/api/auth/refresh`:
  - Invalidates the **old refresh token**.
  - Issues a **new Access + Refresh pair**.
- This ensures **compromise of one token doesn’t grant long-term access**.
- On logout, both tokens are **revoked immediately**.

---

## Secure Token Storage

| Token         | Storage Location                          | Reason                     |
| ------------- | ----------------------------------------- | -------------------------- |
| Access Token  | In-memory (React Context/State)           | Prevent XSS access         |
| Refresh Token | HttpOnly Cookie (Secure, SameSite=Strict) | Prevent JS access and CSRF |

This ensures:

- \*\*No token is ever accessible via \***\*`window.localStorage`\*\*** or \*\***`document.cookie`**
- **Auto-refresh** works silently via cookie, without exposing secrets to JS.

---

## Security Considerations (OWASP)

### Broken Access Control (A01:2021)

- Implemented RBAC middleware checking `req.user.role`.
- Example:
  ```js
  if (user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  ```
- Sensitive routes (like DELETE) require Admin privileges.
- Tokens validated on each request.

---

## API Routes Summary

| Method | Endpoint           | Access     | Description          |
| ------ | ------------------ | ---------- | -------------------- |
| POST   | /api/auth/register | Public     | Create account       |
| POST   | /api/auth/login    | Public     | Login user           |
| POST   | /api/auth/refresh  | Public     | Refresh tokens       |
| POST   | /api/auth/logout   | Auth       | Revoke refresh token |
| GET    | /api/tasks         | User/Admin | Get tasks            |
| POST   | /api/tasks         | User/Admin | Create new task      |
| DELETE | /api/tasks/:id     | Admin only | Delete any task      |
| POST   | /api/tasks/search  | User/Admin | Search tasks         |
| POST   | /api/tasks/filter  | User/Admin | Filter tasks         |

---

## Role Access Matrix

| Action           | Basic User         | Admin               |
| ---------------- | ------------------ | ------------------- |
| Register / Login | allowed            | allowed             |
| Create Task      | allowed            | allowed             |
| View Tasks       | allowed (own only) | allowed (all users) |
| Delete Task      | not allowed        | allowed             |
| Search/Filter    | allowed (own only) | allowed (all users) |

---

##
