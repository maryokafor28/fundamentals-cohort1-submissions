# Flowserve Backend (TypeScript)

A complete, scalable backend for Flowserve — a fintech application handling users and transactions, built with Node.js, Express, PostgreSQL (via Prisma ORM), and TypeScript.

This backend includes:

- Modular API design
- Robust error handling and validation (Zod)
- Logging (Pino)
- Rate limiting (express-rate-limit)
- Pagination and structured response format
- Prisma ORM with PostgreSQL
- Postman API documentation
- README and runnable setup

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Create `.env` and set `DATABASE_URL`
   `DATABASE_URL`
   `PORT=4000`
   `RATE_LIMIT_WINDOW_MS`
   `RATE_LIMIT_MAX`
   `LOG_LEVEL`
   `SIMULATOR_SUCCESS_RATE`

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start dev server:

```bash
npm run dev
```

5. postman documentation at https://web.postman.co/workspace/ee22a894-8b46-4e0e-8625-2f534afebcfc
