# 🏥 PulseTrack API (Node.js + Express + MongoDB)

This project is a backend API for managing PulseTrack — including doctors, patients, appointments, case studies, and prescriptions.  
It is built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, and supports **JWT Authentication with HTTP-only cookies**.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Oreak22/pulseTrack.git
cd pulseTrack-server
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=
MONGO_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
CORS_ORIGIN=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
LOCKED_UNTIL =
BCRYPT_SALT =
```

---

### 4️⃣ Run the Server

#### Development mode (auto reload)

```bash
npm run dev
```

#### Production mode

```bash
npm start
```

The API will start on **http://localhost:4000**

---

````

---

## 🍪 Authentication

This project uses **HTTP-only cookies** for token-based authentication.

When you log in, a JWT access token is stored securely in a cookie:

- `accessToken` — short-lived
- `refreshToken` — longer-lived, used to get new access token

Make sure your frontend requests include:

```js
fetch("http://localhost:5000/api/patients", {
  credentials: "include",
});
````

---

---

## 🧑‍💻 Scripts

| Command       | Description                     |
| ------------- | ------------------------------- |
| `npm run dev` | Start dev server (with Nodemon) |
| `npm start`   | Run production server           |
|               |                                 |

---

