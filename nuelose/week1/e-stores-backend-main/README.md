# E-commerce Cart Service

## Introduction

This is a backend implementation of the Cart Service for an e-stores an e-commerce site. It is part of a proposed microservices architecture to replace a monolithic checkout system, addressing scalability and maintainability issues.

## Proposed Microservices Architecture

The monolithic checkout system is refactored into independent microservices for better scalability and fault isolation. Each service handles a specific domain and communicates via REST APIs or asynchronous events.

<img src="./images/microservices diagram.png" alt="microservice architecture">

## Key Services

### Authentication Service

- **Purpose:** Manages user authentication (login, register). Verifies User identity
- **Data**: User credentials, User profile, tokens.
- **Database:** A collection (users) for storing user data and tokens.
- **Role in Checkout**: Ensures only authenticated users can access their cart, make payments, or place orders.
- **Why make it a microservice:** Authentication service is critical and security-sensitive. Isolating it reduces risk if other services fail.

### Cart Service:

- **Purpose:** Handles cart operations (add, retrieve, remove items).
- **Data** : User ID, product IDs, quantities.
- **Database:** A collection (carts) with one document per user.
- **Role in Checkout**: Tracks what the user wants to buy, provides cart data to Payment and Order Services.
- **Why make it a microservice:** Cart operations are high-traffic (e.g during sales). A dedicated service scales independently.

### Payment Service:

- **Purpose:** Processes transactions via external gateways.
- **Data** : Payment details, transaction IDs, total amount.
- **Database:** A collection (transactions) for storing user data and tokens.
- **Role in Checkout**: Charges the user’s payment method after cart validation.
- **Why make it a microservice:** Payment is sensitive and relies on external APIs. Isolation ensures security, independent scaling and easy update to use another external API.

### Order Service:

- **Purpose:** Creates and confirms orders, updates inventory.
- **Data:** Order details, cart snapshot.
- **Database:** A collection (orders) for storing user data and tokens.
- **Role in Checkout:** Converts a successful payment into a confirmed order.
- **Database:** MongoDB collection (users) for storing user data and tokens.

### Notification Service:

- **Purpose:** Sends order confirmation emails or SMS.
- **Data:** Notification content.
- **Role in Checkout:** By sending order status it can help to improve the user experience.

## Why Microservices?

- **Scalability**: Each service scales independently (e.g., Cart during high volume sales).
- **Maintainability**: Isolated codebases simplify updates.
- **Fault Isolation**: Failure in one service (e.g., Payment) is isolated and doesn’t crash others.

## Interactions

- The API Gateway routes frontend requests to services.
- Services communicate synchronously via REST APIs (e.g., Cart validates user with Auth).
- Asynchronous events (e.g., "Cart Updated" triggers Order creation) use a message queue (not implemented here).
- Each service uses a MongoDB collection for data isolation.

## Note

- Project Scope: Based on the project description focus solely on the Cart Service, a separete Authentication Service was not implemented. Instead, authentication is handled within the Cart Service using authMiddleware to verify JWT tokens.

## Installation and Setup

### Prerequisites

- Node.js: install from [nodejs.org](https://nodejs.org/en).
- Docker: Install from [docker.com]() to run MongoDB.
- npm: installed with nodejs

### Steps to Run the Backend

1. Clone the Repository

```bash
git clone `https://github.com/NueloSE/e-stores-backend`
cd e-stores-backend/cart-service
```

2. Install Dependencies:

```bash
npm install
```

3. Set Up Environment Variables:

- Copy .env.example to .env
- kindly generate jwt secrete by running the command

```sh
node generateJwtSecret.js
```

- The output of the command above should be set as the value of the .env JWT_SECRET variable

4. Run MongoDB in Docker:

- Pull the MongoDB image:

```bash
docker pull mongo
```

- Start a MongoDB container:

```bash
docker run -d --name mongodb -p 27017:27017 -v mongodb-data:/data/db -e MONGO_INITDB_DATABASE=cart_service mongo
```

- Check that it is working using `docker ps`

5. Run the Backend:

```bash
npm run dev
```

- Expected Output: `Server running on port 3000` and `MongoDB connected`

## Testing the API

The Cart Service provides two endpoints:

- POST `/add-to-cart`: Adds an item to a user’s cart.

- GET `/get-cart/`: Retrieves a user’s cart.

Both endpoints require authentication via a JWT token in the Authorization: Bearer <token> header.
