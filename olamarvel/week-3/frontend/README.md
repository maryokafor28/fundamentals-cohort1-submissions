# 🖥️ Secure Task Management Frontend (Week 3 SE Challenge)

## 🚀 Overview

This is the **frontend client** for the **Secure Task Management System**, built with **React + Vite + Tailwind CSS**.
It interacts with the secure Node.js backend API to demonstrate **authentication**, **role-based access**, and **task management** in a production-grade setup.

---

## 🧩 Features

| Feature                            | Description                                                              |
| ---------------------------------- | ------------------------------------------------------------------------ |
| **JWT Auth Integration**           | Handles login, registration, token refresh, and logout with the backend. |
| **Role-Based Dashboard**           | Displays different UI views and permissions for `user` and `admin`.      |
| **Task Management**                | Create, read, search, filter, and delete tasks through secure API calls. |
| **Session Handling**               | Automatically refreshes expired tokens using refresh token cookies.      |
| **Secure HTTP Calls**              | All requests include the Access Token via the `Authorization` header.    |
| **Modern UI**                      | Built with **Tailwind CSS** for sleek, responsive design.                |
| **Form Validation & Sanitization** | Frontend-side data checks before submission.                             |

---

## 🏗️ Folder Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosClient.js
│   ├── components/
│   │   ├── AuthForm.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskCard.jsx
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── AdminPanel.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── utils/
│   │   └── sanitizer.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── favicon.ico
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/secure-task-client.git
cd secure-task-client
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

The frontend will run on **[http://localhost:5173](http://localhost:5173)**
Make sure the backend server is running on **[http://localhost:5000](http://localhost:5000)**

---

## 🧠 How It Works

### 🔐 Authentication Flow

1. User registers or logs in via `/auth/register` or `/auth/login`
2. Backend sends an **Access Token** and **Refresh Token (HttpOnly cookie)**
3. Frontend stores the **Access Token in memory** (not localStorage)
4. Axios interceptors handle:

   * Automatic token attachment in headers
   * Token refresh when expired
5. User logs out → tokens revoked from backend.

**Token Storage Design**

* Access token: Stored in React context (volatile)
* Refresh token: Stored securely in HttpOnly cookie (backend-managed)

---

## 🧰 Core Components

### 🪪 AuthForm.jsx

Handles both registration and login:

```jsx
<AuthForm mode="login" />
<AuthForm mode="register" />
```

### 📋 TaskList.jsx

Displays user’s tasks fetched from the API.
Includes pagination, search, and filter support.

### 🧱 Navbar.jsx

Dynamic navigation menu:

* Shows different links for `admin` and `user`
* Displays logged-in user’s name and logout button

---

## 🔄 API Integration (Axios Client)

`src/api/axiosClient.js`

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // enables refresh token cookie
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## 🔑 Routes Overview

| Path         | Access       | Description                       |
| ------------ | ------------ | --------------------------------- |
| `/register`  | Public       | Create an account                 |
| `/login`     | Public       | Login and receive tokens          |
| `/dashboard` | User & Admin | View and manage tasks             |
| `/admin`     | Admin only   | Manage all tasks and users        |
| `*`          | -            | Redirect to login if unauthorized |

---

## 🎨 UI / UX Design

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Theme:** Dark with soft highlights for tasks
* **Responsive:** Fully mobile and desktop friendly
* **Feedback:** Loading spinners, success/error toasts

Example task dashboard layout:

```
+---------------------------------------+
| Navbar                                |
+---------------------------------------+
| Welcome, John 👋                      |
|                                       |
| [ Create Task ]  [ Search 🔍 ]        |
|                                       |
| ▢ Task 1 – "Buy groceries"            |
| ▢ Task 2 – "Review PRs"               |
| ...                                   |
+---------------------------------------+
```

---

## 🧪 Testing (Optional)

If you include UI tests later:

```bash
npm test
```

You can use **Vitest** or **React Testing Library** for component-level tests.

---

## 🔐 Security Mechanisms in Frontend

| Concern                   | Mitigation                                                            |
| ------------------------- | --------------------------------------------------------------------- |
| **Token Theft**           | Access token stored in memory only. Refresh token in HttpOnly cookie. |
| **XSS**                   | Sanitization via `sanitizeText()` before sending/printing data.       |
| **Broken Access Control** | Role-based route guards with `ProtectedRoute.jsx`.                    |
| **Session Hijacking**     | Backend validates refresh token rotation, invalidates on logout.      |
| **CSRF**                  | Protected by same-site cookies + authorization header scheme.         |

---

## 🧩 Example Login & Task Creation (cURL)

You can test the backend directly from the terminal before connecting frontend:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\"}"

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\"}" | jq -r '.accessToken')

# Create Task
curl -X POST http://localhost:5000/api/tasks -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"title\":\"Frontend test\",\"description\":\"Creating a task via frontend\"}"
```

---

## 🧾 License

This project is released under the **MIT License**.
