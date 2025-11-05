# E-commerce Checkout System - Backend (cart-service)

I implemented the cart-service proof of concept for the Week 1 E-commerce Checkout System challenge. This repo contains the Node.js + TypeScript API that manages products and user carts.

## What I delivered

* Product endpoints: create, list, get single, delete
* Cart endpoints: add to cart, get cart for a user, remove from cart
* TypeScript, Express, Mongoose, MongoDB
* CORS enabled so the frontend can call the API
* Unit tests with Jest + Supertest; optional mongodb-memory-server for isolated tests

## Architectural proposal
![Architecture Diagram](/Architecture.png)

```
[Frontend: React + Vite]  ->  [Cart Service + Product Service (Express + TypeScript)]  ->  [MongoDB]
(calls REST)                  (routes: /api/products, /api/carts)            (collections: products, carts)
```

Notes

* For the challenge I implemented Product and Cart in a single repo to speed delivery.
* In a true microservices deployment these services would run in separate containers and own their own databases.
* Users are tracked by a guest id generated and stored on the frontend.

## Repo layout

```
.
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ src/
│  ├─ index.ts
│  ├─ config/db.ts
│  ├─ models/
│  │  ├─ Product.ts
│  │  └─ Cart.ts
│  ├─ controllers/
│  │  ├─ Products.ts
│  │  └─ Cart.ts
│  ├─ routes/
│  │  ├─ productRoutes.ts
│  │  └─ cartRoutes.ts
│  └─ utils/
└─ tests/
   ├─ product.test.ts
   └─ cart.test.ts
```

## Environment

Copy `.env.example` to `.env` and edit values if needed.

`.env.example`

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cartdb
NODE_ENV=development
```

## Local setup and run

1. Install dependencies

```bash
npm install
```

2. Run in development

```bash
npm run dev
```

3. Build and run production

```bash
npm run build
npm start
```

## API summary

Base URL: `http://localhost:5000/api`

### Products

* `POST /api/products/add`

  * Body: `{ name: string, image: string, inStock: number }`
  * Response: created product object
* `GET /api/products/`

  * Response: array of products
* `GET /api/products/product/:id`

  * Response: single product
* `DELETE /api/products/remove/:id`

  * Response: deletion confirmation

### Cart

* `POST /api/carts`

  * Body: `{ userId: string, productId: string }`
  * Behavior: find or create cart for user, push `productId` into `products` array
  * Response: updated cart object
  * This maps to the task example `POST /add-to-cart`
* `GET /api/carts/:userId`

  * Response: user cart with populated product details
  * This maps to the task example `GET /get-cart/:userId`
* `DELETE /api/carts/remove`

  * Body: `{ userId: string, productId: string }`
  * Behavior: remove productId from user cart, return updated cart

## Example curl calls

Add product

```bash
curl -X POST http://localhost:5000/api/products/add \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","image":"https://via.placeholder/1.png","inStock":10}'
```

List products

```bash
curl http://localhost:5000/api/products/
```

Add to cart

```bash
curl -X POST http://localhost:5000/api/carts \
  -H "Content-Type: application/json" \
  -d '{"userId":"guest-123","productId":"<PRODUCT_ID>"}'
```

Get cart

```bash
curl http://localhost:5000/api/carts/guest-123
```

Remove from cart

```bash
curl -X DELETE http://localhost:5000/api/carts/remove \
  -H "Content-Type: application/json" \
  -d '{"userId":"guest-123","productId":"<PRODUCT_ID>"}'
```

## Tests

Run tests

```bash
npm test
```

Notes

* Tests use Jest and Supertest.

## CORS

CORS is enabled. To restrict origins edit `src/index.ts` and set the origin to your frontend URL:

```ts
app.use(cors({ origin: "http://localhost:5173" }));
```

## Frontend repo link

[Frontend](https://github.com/olamarvel/week-1-frontend)
