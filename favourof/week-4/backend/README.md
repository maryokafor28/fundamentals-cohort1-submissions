## DevConnect Backend - A Lightweight Developer Collaboration Platform

DevConnect Backend is a Node.js + TypeScript REST API built to power the DevConnect platform — a space for developers to share posts, comment, and connect.  
It includes secure authentication, input validation, environment-based configuration, and robust logging.

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Joi
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Winston + Morgan
- **Testing:** Jest + Supertest
- **Environment Management:** dotenv
- **Deployment:** Render

---

## 📂 Project Structure

src/
├── controllers/ # Business logic for each resource (auth, posts, comments)
├── routes/ # Express routes for APIs
├── models/ # Mongoose models (User, Post, Comment)
├── middlewares/ # Authentication and validation middlewares
├── utils/ # Helpers (logger, AppError, asyncHandler)
├── config/ # Environment and DB configuration
├── tests/ # Jest unit and integration tests
└── index.ts # Application entry point

---

## ⚙️ Environment Variables

The project uses two environment files:

- `.env` — for development
- `.env.prod` — for production

### Example `.env`

PORT=4001
MONGODB_URL=mongodb://localhost:27017/devconnect
NODE_ENV=development

ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

BCRYPT_SALT_ROUNDS=12
FRONTEND_ORIGIN=(https://dev-connect-frontend-two.vercel.app)
COOKIE_DOMAIN=[localhost](https://dev-connect-frontend-two.vercel.app)

## Setup & Run Instructions

# 1️⃣ Clone the repository

git clone (https://github.com/Favourof/dev-connect-backemd.git)
cd devconnect-backend

# 2️⃣ Install dependencies

npm install

# 3️⃣ Set up environment files

Create .env and .env.prod using the example above.

# 4️⃣ Run in development mode

npm run dev

# 5️⃣ Build and run in production

npm run build
npm run start

# 🧪 Testing

npm run test

Output:

PASS src/tests/user.test.ts
PASS src/tests/post.test.ts
PASS src/tests/comment.test.ts

Test Suites: 3 passed, 3 total
Tests: 10 passed, 10 total

[./jest_test.png]

# 🌐 API Documentation

Postman Collection: 🔗 View API Documentation

(https://documenter.getpostman.com/view/33609178/2sB3QQHmvv)

# 🚀 Deployment

Deploying to Render

Push your project to GitHub.

Go to Render.com

Create a new “Web Service”.

Connect your GitHub repository.

Set the build command:

npm install && npm run build

Set the start command:

npm run start

Add environment variables from .env.prod.

Deploy 🎉

# Fontend deployment url

(https://dev-connect-frontend-two.vercel.app/)

👨‍💻 Author

Favour Omotosho
Backend Developer | Node.js | TypeScript
