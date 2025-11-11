## MICROSERVICE-ECOMMERCE APP

This is a simple microservice-based application that allows users to sign up, log in, add items to their cart, and view their cart.
The project is split into **backend services** (authentication & cart) and a **frontend app**.

---

## TECH STACK

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, CORS
- Frontend: Next.js / ReacT, TailwindCss, shadcn
- Environment: TypeScript, dotenv, cors

---

## SETUP INSTRUCTIONS

### 1. Clone the Repository

bash
git clone
---BASH
(https://github.com/maryokafor28/cart-auth-services.git)```

### 2. Backend Setup

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in `backend/` with the following:
   ```
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   PORT=5000
   ```
4. Start the backend server:

   ```bash
   npm run dev
   ```

---

### Frontend Setup

The frontend lives in a **separate repository** from the backend. To run it locally:

1. Clone the frontend repo:

   ```bash
    https://github.com/maryokafor28/cart-authui.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   - If your backend is deployed (e.g., Render, Vercel, Railway), replace it with the deployed API URL.

3. Run the frontend development server:

   ```bash
   npm run dev
   ```

4. The app will be available at:
   **[http://localhost:3000](http://localhost:3000)**
5. Deployed link:
   ```bash
   http://cart-authui-5jcn.vercel.app
   ```

---

**Reminder**: The backend must be running first before the frontend can fetch data.

## API ENDPOINTS

### Authentication

#### 1. **Registere**

- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "123456"
  }
  ```

- **Response**:

  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": "64b8c1e...",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
  ```

---

#### 2. **Login**

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "identifier": "john@example.com",
    "password": "123456"
  }
  ```

- **Response**:

  ```json
  {
    "message": "Login successful",
    "token": "jwt-token-here"
  }
  ```

---

### Cart Service

#### 3. **Add to Cart**

- **URL**: `/cart/addToCart`
- **Method**: `POST`
- **Headers**:
  `Authorization: Bearer <jwt-token>`
- **Request Body**:

  ```json
  {
    "productId": "12345",
    "name": "LCD Monitor",
    "price": 650,
    "quantity": 1
  }
  ```

- **Response**:

  ```json
  {
    "message": "Item added to cart",
    "cartItem": {
      "productId": "12345",
      "name": "LCD Monitor",
      "price": 650,
      "quantity": 1
    }
  }
  ```

---

#### 4. **Get Cart**

- **URL**: `/getcart`
- **Method**: `GET`
- **Headers**:
  `Authorization: Bearer <jwt-token>`
- **Response**:

  ```json
  {
    "cart": [
      {
        "productId": "12345",
        "name": "LCD Monitor",
        "price": 650,
        "quantity": 1
      }
    ]
  }
  ```

---

## Project Structure

```
/src
  ├── controller/
  ├── models/
  ├── routes/
  ├── services/
  ├── server.ts
  └── .env

/frontend
  ├── public/
  ├── app/
  ├── components/
```

---

## Testing API with Postman

1. Start the backend server.
2. Use Postman or Thunder client.
3. Test **register → Login → AddToCart → getCart** flow.

---

---

## Proposed Microservices Architecture

This follows a **microservices-based architecture** for the checkout system. Each service is independent and communicates with others via APIs or events.

### Services

1. **Authentication Service** – Handles user registration, login, and JWT tokens.
2. **Product Catalog Service** – Manages product data (name, price, description, images).
3. **Cart Service** – Handles user carts (add/remove/update items).
4. **Inventory Service** – Tracks stock levels and reserves items during checkout.
5. **Pricing Service** – Calculates totals, applies discounts, taxes, and fees.
6. **Checkout Service** – Orchestrates checkout flow by coordinating other services.
7. **Payment Service** – Integrates with payment providers and processes payments.
8. **Order Service** – Stores finalized orders and their statuses.
9. **Shipping Service** – Handles delivery addresses and shipment tracking.
10. **Notification Service** – Sends emails or SMS for confirmations and updates.

---

### Architecture Overview

Here is the systme Archtecture
![system Architecture](./Image/microservice%20architecture.drawio.png)

The **Checkout Service** acts as the central orchestrator, working with Cart, Inventory, Pricing, Payment, Order, Shipping, and Notification services to complete the checkout process.

## Author

Developed by Amadi Mary.
Contributions & feedback are welcome!
