generate Access token using
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"


#  Secure Task Management API (Backend)

A robust **Node.js + TypeScript + Express + MongoDB** backend implementing **JWT authentication**, **token rotation**, **role-based access control (RBAC)**, and **account lockout protection**.  
Built as part of a secure multi-role task management challenge.

---

##  Features

| Feature | Status | Description |
|----------|---------|-------------|
| **User Registration & Login** | ✅ | Register and log in securely using bcrypt-hashed passwords. |
| **JWT Authentication** | ✅ | Issues short-lived Access Token (10s–15m) and long-lived Refresh Token (7d). |
| **Token Rotation & Logout** | ✅ | Refresh tokens are rotated on use and blacklisted on logout. |
| **Role-Based Access Control (RBAC)** | ✅ | Supports `user` and `admin` roles; Admin can delete any task. |
| **Login Lockout** | ✅ | Locks user after 3 failed login attempts for 30 minutes. |
| **Task Management** | ✅ | Users can create, view, and delete their own tasks; Admin can delete all. |
| **Input Validation** | ✅ | Manual sanitization and validation for `/auth` and `/tasks` routes. |
| **Security Middleware** | ✅ | Uses Helmet, CORS, and cookie-parser for secure headers and cookies. |
| **MongoDB Integration** | ✅ | Persistent data store for users, tokens, and tasks. |

---


##  Project Setup

### Clone the Repository
```bash
git clone https://github.com/yourusername/task-api-backend.git
cd task-api-backend
```
### Install Dependencies
```bash
Copy code
npm install
```
### Environment Variables
Create a .env file in the project root with:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskdb
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```
### generate Access token using
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
### Run the Server
```bash
npm run dev
Server will start on:
http://localhost:5000
```

### Authentication Flow
```
[Client Login/Register]
        ↓
POST /auth/login → Issues Access & Refresh tokens
        ↓
Access Token expires (~15m)
        ↓
Client calls /auth/refresh using HttpOnly refresh cookie
        ↓
Server rotates refresh token → Issues new Access Token
        ↓
/auth/logout → Invalidates current refresh token
```
### API Endpoints
Auth Routes (/auth)
Method	Endpoint	    Description
POST	/auth/register	Register new user
POST	/auth/login	    Log in & receive tokens
POST	/auth/refresh	Get new access token
POST	/auth/logout	Log out & invalidate token
### Task Routes (/tasks)
Method	Endpoint	Access	Description
GET	    /tasks	    User	Fetch user’s own tasks
POST	/tasks	    User	Create a new task
DELETE	/tasks/:id	Admin	Delete any task
DELETE	/tasks/:id	User	Delete own task only

 All /tasks routes require Authorization: Bearer <access_token> header.


### Example Test Sequence
1. Register a new user
```
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```
2. Login to receive tokens
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
returns accessToken 
```

3. Access protected route
```
GET /tasks
Authorization: Bearer <accessToken>
```
4. Refresh expired token
```
POST /auth/refresh
(with cookie automatically sent)
returns new accessToken
```
5. Logout
```bash
POST /auth/logout
clears cookie and invalidates refresh token
```

