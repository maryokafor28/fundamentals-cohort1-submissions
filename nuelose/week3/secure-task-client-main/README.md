# Task Management Platform Frontend

This is the frontend for the Task Management Platform, built with **React**, **Vite**, and **TypeScript**. It connects to a Node.js/Express backend API to provide user authentication, task management, and role-based access control (RBAC). The frontend implements secure JWT handling and mitigates common web vulnerabilities such as Broken Access Control (OWASP A01:2021) and Injection (OWASP A03:2021).

## Features

- **User Authentication**: Register and login with email/password, supporting `user` and `admin` roles.
- **Task Management**: Create, view, and (for admins only) delete tasks.
- **Secure Token Handling**: Access tokens stored in memory; refresh tokens managed via HttpOnly cookies.
- **Role-Based Access Control (RBAC)**: Admin-only task deletion, enforced both client-side (UI) and server-side.
- **Search and Filter**: Paginated task search and filtering, restricted to user-owned tasks for non-admins.

## Prerequisites

- **Node.js**: v18 or higher.
- **Backend API**: Running locally at `http://localhost:3000` (see backend repository for setup).
- **Git**: For cloning and version control.

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/NueloSE/secure-task-client.git
   cd secure-task-client
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Create Environment File**:

   - Copy the `.env.example` file to create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` to set the API base URL (default: `http://localhost:3000`):
     ```
     VITE_API_BASE_URL=http://localhost:3000
     ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   - The app runs at `http://localhost:5173` by default.

## Usage

1. **Register**: Create an account with email, password, and role (`user` or `admin`).
2. **Login**: Authenticate to receive an access token and access the task dashboard.
3. **Tasks**:
   - All users can create tasks and view their own tasks.
   - Admins can delete any task.
   - Use search/filter forms to query tasks (paginated results).
4. **Logout**: Clears the session and invalidates the refresh token.

---
