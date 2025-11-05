# DevConnect - Backend

Lightweight developer collaboration platform API

---

## What this repo contains

* REST API built with Node.js and Express
* MongoDB via Mongoose for persistence
* Authentication with JWT
* CRUD for users, projects, and comments
* Input validation and error handling
* Unit tests with Jest
* Postman API Documentation published
* Deployment-ready config

---

## Quick status

* Backend: complete
* [![Unit tests: written and passing locally](/Screenshot_17-10-2025_193747_studio.firebase.google.com.jpeg)](/Screenshot_17-10-2025_193747_studio.firebase.google.com.jpeg)
* Postman docs: published : [https://documenter.getpostman.com/view/49353777/2sB3QQHSyq](https://documenter.getpostman.com/view/49353777/2sB3QQHSyq)
* Deployed backend URL :  [https://breveweek-4.onrender.com]( https://breveweek-4.onrender.com )

---

## Tech stack

* Node.js (v18+)
* Express
* MongoDB + Mongoose
* JWT for auth
* Jest for unit tests
* Supertest for API integration tests
* dotenv for environment variables

---

## Repo layout

```
.
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   └── utils
├── tests
│   └── *.test.js
├── .env.example
├── package.json
└── README.md
```

---

## Environment variables

Create a `.env` at repo root. Example `.env.example`:

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=supersecret_jwt_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
CLIENT_URL=http://localhost:5173
```

Change values for production. Never commit real secrets.

---

## Install and run (local)

1. Clone repo and cd into it

```bash
git clone https://github.com/olamarvel/breveweek-4-
cd breveweek-4-
```

2. Install

```bash
npm ci
```

3. Create `.env` from `.env.example` and fill values
4. Start dev server

```bash
npm run dev
```

Server should run at `http://localhost:3000` or the port you set.

---

## Run tests

```bash
npm test
```

* Jest will run unit tests and report results.
* Add `--coverage` if you want coverage output:

```bash
npm test -- --coverage
```

* [![Unit tests: written and passing locally](/Screenshot_17-10-2025_193747_studio.firebase.google.com.jpeg)](/Screenshot_17-10-2025_193747_studio.firebase.google.com.jpeg)

---


---

## Scripts (example)

```json
"scripts": {
  "dev": "ts-node src/index.js",
  "start": "node dist/index.js",
  "test": "jest --runInBand",
  "lint": "eslint .",
  "prepare": "husky install"
}
```
---

## API Overview

Base URL: `{{API_BASE_URL}}` (local `http://localhost:3000`)

### Auth

* `POST /api/auth/register` - register user

  * body: `{ "name", "email", "password" }`
  * returns: JWT token and user object

* `POST /api/auth/login` - login

  * body: `{ "email", "password" }`
  * returns: JWT token and user object

* `GET /api/auth/me` - get current user

  * header: `Authorization: Bearer <token>`

### Users

* `GET /api/users/:id` - get user profile (public)
* `PUT /api/users/:id` - update profile (auth required)

### Projects

* `GET /api/projects` - list projects (supports pagination and filters)

  * query params: `?page=1&limit=10&author=userid`
* `POST /api/projects` - create project (auth required)

  * body: `{ title, description, tags, repoUrl }`
* `GET /api/projects/:id` - project details including comments
* `PUT /api/projects/:id` - update project (owner only)
* `DELETE /api/projects/:id` - delete project (owner or admin)

### Comments

* `POST /api/projects/:projectId/comments` - add comment (auth required)

  * body: `{ text }`
* `DELETE /api/comments/:id` - delete comment (owner or admin)

---

## Example curl requests

Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Dev","email":"jane@example.com","password":"StrongPass123"}'
```

Create project:

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Cool Idea","description":"Short pitch","tags":["node","api"],"repoUrl":"https://github.com/jane/cool"}'
```

---

## Postman Collection and API docs

* Postman collection file: `devconnect.postman_collection.json`
* [Postman docs URL](https://documenter.getpostman.com/view/49353777/2sB3QQHSyq)`
  Make sure the docs show authentication workflow and example responses.

---

* 4xx responses for client errors, 5xx for server issues.

---

## Security notes

* Passwords hashed with bcrypt and stored only hashed.
* JWT secret must be strong and never committed.
* Enable CORS with safe origins only.
* Rate limiting recommended on auth endpoints to prevent brute force.
* Use HTTPS in production.


