Secure Token API
This repository contains the backend API for a secure task management system using JWT authentication, token rotation, and secure token storage. Deployed backend URL: https://secure-token-api.onrender.com

Table of Contents
Project Overview
Backend Setup
Frontend Setup
JWT Authentication Flow
Security Mitigations
API Endpoints
Project Overview
The backend API provides:

User registration and login with JWT authentication
Task management
Secure handling of access and refresh tokens using HttpOnly cookies
Mitigation against common vulnerabilities like Broken Access Control and Injection
The frontend is maintained in a separate repository. It communicates with this backend via HTTP requests to the deployed API.

Backend Setup
Clone the backend repository:
https://github.com/maryokafor28/secure-token-api.git
Install dependencies:
npm install
Create a .env file:
PORT=4000
MONGO_URI=<Your MongoDB URI>
JWT_ACCESS_SECRET=<Your Access Token Secret>
JWT_REFRESH_SECRET=<Your Refresh Token Secret>
Run the backend:
npm run dev
Your backend will run on http://localhost:4000.

Using the Deployed API
Users can interact with the deployed backend without setting up locally.

Base URL: https://secure-token-api.onrender.com/api

Example with Postman

Login
POST https://secure-token-api.onrender.com/api/auth/login
Body (JSON):

{
"email": "youruser@example.com",
"password": "yourpassword"
}
Response:

Sets HttpOnly cookies accessToken and refreshToken.

Access Protected Tasks Endpoint
GET https://secure-token-api.onrender.com/api/tasks
Ensure your client (frontend or Postman) sends cookies with the request:

In Postman: go to Cookies → the cookies set from login will be sent automatically.

Response: Returns the authenticated user’s tasks.

Frontend Setup
Since the frontend is a separate repository:

Clone your frontend repository:
https://github.com/maryokafor28/secure-token-ui.git```

2. Install dependencies:

```bash
npm install
Create a .env.local file pointing to the deployed backend (or local backend for development):
NEXT_PUBLIC_API_URL=http://localhost:4000/api
Run the frontend:
npm run dev
Your frontend will run on http://localhost:3000.

JWT Authentication Flow
Access Tokens
Short-lived (15 minutes)
Stored as HttpOnly cookies (accessToken)
Used to authorize protected API endpoints
Refresh Tokens
Long-lived (7 days)
Stored as HttpOnly cookies (refreshToken)
Used to request new access tokens
Token Rotation Strategy
On refresh, issue a new refresh token and blacklist the old one
Prevents replay attacks and enhances security
Secure Storage Method
Tokens are never stored in localStorage or sessionStorage
HttpOnly cookies prevent access from JavaScript
Cookies are sent automatically with withCredentials: true in frontend requests
Security Mitigations
Broken Access Control (A01)

Role-based access control (RBAC): Each JWT includes a role claim, checked before accessing sensitive endpoints.

Route protection: Middleware verifies access tokens for all protected routes.

Token blacklisting: Refresh tokens are blacklisted after use to prevent reuse or privilege escalation.

Injection (A03)
Input validation: All user inputs are validated server-side before being used in database queries.

MongoDB queries: No string concatenation; always use parameterized queries (Mongoose).

Escape user input: Any dynamic content is sanitized before being executed.## API Endpoints

Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user, set tokens in HttpOnly cookies
POST	/api/token/refresh	Refresh access token using refresh token cookie
POST	/api/token/logout	Clear access and refresh cookies
GET	/api/tasks	Get user tasks (protected)
POST	/api/tasks	Create new task (protected)
DELETE	/api/tasks/:id	Delete task (protected)
Secure Storage Method
For this project, JWTs (access and refresh tokens) are stored in HttpOnly cookies managed by the backend. Here’s why and how this approach works:

Why HttpOnly Cookies
HttpOnly flag: Prevents JavaScript from accessing the cookies. This mitigates XSS (Cross-Site Scripting) attacks, because malicious scripts on the frontend cannot read the token.
Secure flag: Ensures cookies are only sent over HTTPS, protecting tokens from being intercepted in transit.
SameSite=None: Required for cross-origin requests (e.g., frontend on Vercel, backend on Render) so cookies are sent automatically with requests.
How It Works
When a user logs in, the backend generates access and refresh tokens.
The backend sets these tokens as HttpOnly cookies on the response. Example:
res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: true,        // only sent over HTTPS
  sameSite: "none",    // allows cross-site requests
  maxAge: 15 * 60 * 1000 // 15 minutes
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
Subsequent frontend requests (Axios with withCredentials: true) automatically include the cookies.
The backend reads the cookies to verify authentication and authorization.
By storing tokens in HttpOnly cookies, the application minimizes the risk of token theft via XSS, while allowing secure cross-origin requests between frontend and backend.

```
