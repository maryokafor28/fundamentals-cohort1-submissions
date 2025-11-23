# E-commerce Backend API

A Node.js/Express.js backend service for an e-commerce cart management system with user authentication and cart operations.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest with Supertest
- **Environment**: dotenv for configuration
- **Security**: bcryptjs for password hashing

## 📁 Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── auth.js          # Authentication logic
│   └── cart.js          # Cart operations
├── middleware/          # Custom middleware
│   └── auth.js         # JWT authentication middleware
├── models/             # Database models
│   ├── User.js         # User schema
│   └── Cart.js         # Cart schema
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   └── cart.js         # Cart routes
├── tests/              # Test suites
│   ├── controllers/    # Controller tests
│   ├── middleware/     # Middleware tests
│   └── routes/         # Route tests
├── config/             # Configuration files
│   └── database.js     # Database connection
└── app.js              # Express app setup
```

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Git** - [Download here](https://git-scm.com/)
- **npm** (comes with Node.js) or **yarn**

### Step-by-Step Setup


0: frontend repo https://github.com/Tjoseph-O/ecommerce-frontend.git

#### 1. Clone the Repository
```bash

git clone https://github.com/Tjoseph-O/ecommerce-cart-service.git


cd ecommerce-backend
```

#### 2. Install Dependencies
```bash

npm install


yarn install
```

#### 3. Set Up Environment Variables
```bash

cp .env.example .env


touch .env
```

#### 4. Configure Environment Variables
Edit the `.env` file with your settings:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-make-it-long-and-random

# Optional: Test Database (for running tests)
TEST_MONGODB_URI=mongodb://localhost:27017/ecommerce_test
```

#### 5. Set Up Database

**Option A: Local MongoDB**
```bash

brew services start mongodb-community


sudo systemctl start mongod


```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string

#### 6. Start the Development Server
```bash

npm run dev


```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

#### 7. Verify Installation
Open a new terminal and test the API:
```bash

curl http://localhost:5000/api/health

# Expected response:
# {"success": true, "message": "Server is running"}
```



### Next Steps After Setup

1. **Run Tests** to ensure everything works:
   ```bash
   npm test
   ```

2. **Check API Documentation** below for available endpoints

3. **Set up Frontend** (if applicable) to connect to this backend

4. **Review Environment Configuration** for production deployment

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

### Cart Endpoints

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer <jwt-token>
```

#### Add Item to Cart
```http
POST /api/cart/add
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "productId": "product-123",
  "name": "Product Name",
  "price": 29.99,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/update/:productId
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /api/cart/remove/:productId
Authorization: Bearer <jwt-token>
```

#### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer <jwt-token>
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens can also be sent via the `x-auth-token` header:

```
x-auth-token: <your-jwt-token>
```

## 🗃️ Database Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model
```javascript
{
  userId: ObjectId (required, ref: 'User'),
  items: [{
    productId: String (required),
    name: String (required),
    price: Number (required),
    quantity: Number (required),
    subtotal: Number (calculated)
  }],
  totalAmount: Number (calculated),
  totalItems: Number (calculated),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

Run the test suite:

```bash

npm test


npm run test:watch


npm run test:coverage


npm test -- auth.test.js
```

### Test Structure

- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints end-to-end
- **Middleware Tests**: Test authentication and validation middleware

## 🔧 Available Scripts

```bash
npm start         
npm run dev       
npm test           
npm run test:watch 
npm run lint       
npm run lint:fix  
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ecommerce |
| `JWT_SECRET` | JWT signing secret | Required |
| `NODE_ENV` | Environment mode | development |

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```



## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Protected routes with authentication middleware
- User account status checking (active/inactive)

## 📝 Development Notes

### Adding New Endpoints

1. Create route handler in appropriate controller
2. Add route definition in routes file
3. Add authentication middleware if needed
4. Write tests for the new endpoint
5. Update this documentation

### Database Operations

The application uses Mongoose for MongoDB operations. All models include:
- Automatic timestamps (`createdAt`, `updatedAt`)
- Input validation
- Custom methods for common operations

### Testing Guidelines

- Write tests for all new features
- Include both success and error cases
- Mock external dependencies
- Maintain high test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.