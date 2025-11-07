# 🌟 FlowServe Frontend

**FlowServe Frontend** is a modern, responsive React + TypeScript web interface that connects seamlessly with the FlowServe backend API.  
It provides a clean dashboard, user management, and transaction tracking — built with a focus on performance, accessibility, and developer productivity.

---

## ⚙️ Tech Stack

| Category      | Tools Used                                                   |
| ------------- | ------------------------------------------------------------ |
| Framework     | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) |
| Language      | TypeScript                                                   |
| Styling       | [TailwindCSS](https://tailwindcss.com/)                      |
| UI Components | [shadcn/ui](https://ui.shadcn.com/)                          |
| Animation     | [Framer Motion](https://www.framer.com/motion/)              |
| Toasts        | [Sonner](https://sonner.emilkowal.ski/)                      |
| Routing       | [React Router DOM v6](https://reactrouter.com/)              |
| API Client    | Axios                                                        |
| Deployment    | [Vercel](https://vercel.com/)                                |

---

## 📁 Folder Structure

```
src/
├── api/
│   ├── axiosClient.ts
│   ├── userService.ts
│   └── transactionService.ts
├── components/
│   ├── layout/
│   │   └── Layout.tsx
│   ├── modals/
│   │   └── ModalForm.tsx
│   └── ui/ (from shadcn)
├── pages/
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── Transactions.tsx
│   └── NotFound.tsx
├── router/
│   └── index.tsx
├── App.tsx
└── main.tsx
```

---

## 🚀 Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/flowserve-frontend.git
cd flowserve-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

Visit the app at **http://localhost:5173**

---

## 🌐 Environment Variables

Create a `.env` file in the root of your project:

```bash
VITE_API_BASE_URL=https://flowserve-backend.onrender.com/api/v1
```

---

## 🧱 Features

### 🏠 Dashboard

- Displays summary cards: Total Users, Total Transactions, Total Balance
- Shows recent transactions with animated entry

### 👤 Users Page

- Displays list of users
- “Create User” button opens modal
- Toast notifications for success/error

### 💳 Transactions Page

- Lists all transactions (credit/debit)
- “Create Transaction” modal
- Real-time balance update after transaction

### 🚫 404 Page

- Animated “Page Not Found”
- Styled using Framer Motion and Tailwind

---

## 🔒 Security & Best Practices

- **CORS-secured API requests**
- **Environment-based base URL**
- **Type-safe API services**
- **No inline credentials or secrets**

---

## 📡 API Integration

All requests use a centralized Axios client (`api/axiosClient.ts`) configured with:

- Base URL from `VITE_API_BASE_URL`
- Automatic JSON parsing
- Error handling and interceptors

Endpoints follow REST and HATEOAS conventions (e.g., `/api/v1/users`, `/api/v1/transactions`).

---

## 🌍 Deployment

Deployed Frontend: [https://flowserve-frontend-one.vercel.app/](https://flowserve-frontend-one.vercel.app)  
Connected Backend: [https://flowserve-backend.onrender.com](https://flowserve-backend.onrender.com)

---

## 🧩 Credits

Developed by **Favour Omotosho**  
Built for _Week 6 Project Challenge_ — integrating PostgreSQL, Prisma ORM, and React Frontend.
