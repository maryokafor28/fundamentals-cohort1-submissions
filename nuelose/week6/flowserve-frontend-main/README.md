# FlowServe Frontend

A React + TypeScript + Vite + TailwindCSS frontend for the **FlowServe Wallet Application** — a digital wallet system for managing users and transactions.

---

## Features

- Dashboard overview for system stats
- User management (view, create, edit, delete)
- Transaction management (deposit, withdrawal, transfer)
- Fast and lightweight frontend built with Vite
- Styled with Tailwind CSS
- API integration with the backend via REST endpoints

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **React Router DOM**
- **Tailwind CSS**
- **React Icons**

---

## Environment Setup

Before running the app, create a `.env` file in the root directory:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

> The backend **must be running** for the frontend to connect successfully.

---

## Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/nuelose/flowserve-frontend.git

cd flowserve-frontend


npm install
```

---

## Development

To start the local development server:

```bash
npm run dev
```

This runs the app on:
[http://localhost:5173](http://localhost:5173)

Ensure your backend API (running at `http://localhost:3001`) is active.

---

To preview the built version locally:

```bash
npm run preview
```

---

## Backend Connection

This frontend interacts with the **FlowServe Backend API** via REST endpoints.
The base URL is defined in `.env` as:

```
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

Ensure the backend is running before loading the frontend.
Example endpoints the frontend consumes:

- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/transactions`
- `POST /api/v1/transactions`

---

## Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start development server  |
| `npm run build`   | Create production build   |
| `npm run preview` | Preview the build locally |
| `npm run lint`    | Lint codebase for errors  |

---

## Developer Notes

- All API requests use the base URL from `VITE_API_BASE_URL`.
- Update `.env` if backend port or path changes.
- Ensure CORS is enabled in your backend for `http://localhost:5173`.

---

## 🧑 Author

**FlowServe Dev Team**
Frontend built with using React + TypeScript.

---
