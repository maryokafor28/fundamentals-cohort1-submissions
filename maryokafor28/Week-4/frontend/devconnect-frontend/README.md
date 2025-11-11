---


```markdown
#  DevConnect Frontend

This is the **frontend** for DevConnect — a social platform for developers to showcase projects, comment, and collaborate.  
Built using **Next.js (App Router)** and styled with **Tailwind CSS + ShadCN UI**.

---

## Live Site

🔗 **https://devconnect-frontend-azure.vercel.app**

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS + ShadCN UI**
- **React Context (AuthProvider)** for global auth state
- **Fetch API** for backend integration
- **Vercel** for deployment

---

## Setup Instructions

### 1 Clone the Repository

```bash
git https://github.com/maryokafor28/devconnect-frontend.git
cd devconnect-frontend

##  install Dependenciee
```

npm install

```
## create .env.loacl file
NEXT_PUBLIC_API_BASE_URL=https://devconnect-backend-l07f.onrender.com

##  Run Locally

npm run dev

Authentication Flow

Login and Register connect directly to backend /api/auth/... routes.

Auth tokens are stored in secure HttpOnly cookies.

User session is automatically refreshed via /api/auth/refresh.

Logout clears the cookie and redirects to login.

Features

JWT-based Authentication

Project CRUD (Create, Edit, Delete, View)

Comments per project

Profile management (Edit your own, view others)

Responsive, modern UI

Deployed on Verce



```
