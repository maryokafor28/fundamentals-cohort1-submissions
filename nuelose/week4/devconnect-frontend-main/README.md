# DevConnect-Frontend

A lightweight platform where developers share ideas, collaborate on projects, and connect with the community.

## Tech Stack

React + TypeScript

Vite

Tailwind CSS

React Router

Axios (for API calls)

## Setup Instructions

Clone the repository

```bash
git clone https://github.com/nuelose/devconnect-frontend.git
cd devconnect-frontend
```

Install dependencies

```
npm install
```

Set up environment variables
Create a .env file in the project root:

VITE_API_URL=https://devconnect-backend-delta.vercel.app/api

Run locally

```
npm run dev
```

Visit `http://localhost:5173`

## Build for production

```
npm run build
```

```
 Project Structure
src/
├── components/     # Reusable UI components (Nav, Footer, etc.)
├── pages/          # Main app pages (Landing, SignIn, Register)
├── assets/         # Images & static files
├── App.tsx         # Route definitions
└── main.tsx        # Entry point
```

🔗 [Frontend-Live-Link]("https://devconnect-frontend-theta.vercel.app/")

🔗 [Backend-server]("https://devconnect-backend-delta.vercel.app/api")
