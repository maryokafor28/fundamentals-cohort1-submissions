Frontend Link: https://github.com/CodeWithEugene/Brave-Bedemptive-E-commerce-Checkout-Frotend.git

# Brave Redemptive E-commerce Backend

A robust Node.js backend API for the e-commerce cart service, built as part of the microservices architecture challenge.

## 🏗️ Architecture Overview

This is the **Cart Service** in a microservices-based e-commerce system. It handles all cart-related operations including adding items, updating quantities, removing items, and managing user cart state.

### Microservices Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Cart Service  │    │   MongoDB       │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Database      │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │              ┌─────────────────┐             │
        └─────────────►│  Future Services │◄────────────┘
                       │  - Auth Service  │
                       │  - Order Service │
                       │  - Payment Svc   │
                       └─────────────────┘
```

## 🚀 Features

- **RESTful API**: Clean, well-documented endpoints
- **MongoDB Integration**: Robust data persistence with Mongoose ODM
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Global error handling with detailed error responses
- **CORS Support**: Configured for frontend integration
- **Security**: Helmet.js for security headers
- **Logging**: Morgan for request logging in development
- **Database Seeding**: Automated sample data creation

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone and Navigate

```bash
cd /path/to/Brave-Bedemptive-E-commerce-Checkout-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment file:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/brave_ecommerce
MONGODB_TEST_URI=mongodb://localhost:27017/brave_ecommerce_test

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Ubuntu/Debian
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb-community

# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Seed the Database

Populate the database with sample products:

```bash
npm run seed
```

### 6. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will be available at `http://localhost:5000`

## 📚 API Endpoints

### Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/` | API welcome message | - |
| `GET` | `/health` | Health check endpoint | - |
| `GET` | `/get-cart/:userId` | Get user's cart | - |
| `POST` | `/add-to-cart` | Add item to cart | `{ userId, productId, quantity }` |
| `PUT` | `/update-cart-item` | Update item quantity | `{ userId, itemId, quantity }` |
| `DELETE` | `/remove-from-cart` | Remove item from cart | `{ userId, itemId }` |
| `DELETE` | `/clear-cart/:userId` | Clear entire cart | - |

### API Response Format

All endpoints return responses in this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors if applicable */ ]
}
```

## 📖 API Documentation

### Get User Cart

```bash
GET /get-cart/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "userId": "user123",
    "items": [
      {
        "_id": "item_id",
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 99.99,
          "image": "image_url"
        },
        "quantity": 2,
        "addedAt": "2023-01-01T00:00:00Z"
      }
    ],
    "totalPrice": 199.98
  }
}
```

### Add Item to Cart

```bash
POST /add-to-cart
Content-Type: application/json

{
  "userId": "user123",
  "productId": "product_id",
  "quantity": 1
}
```

### Update Cart Item

```bash
PUT /update-cart-item
Content-Type: application/json

{
  "userId": "user123",
  "itemId": "item_id",
  "quantity": 3
}
```

### Remove Item from Cart

```bash
DELETE /remove-from-cart
Content-Type: application/json

{
  "userId": "user123",
  "itemId": "item_id"
}
```

### Clear Cart

```bash
DELETE /clear-cart/:userId
```

## 📁 Project Structure

```
src/
├── config/
│   └── database.js         # Database connection configuration
├── controllers/
│   └── cartController.js   # Cart business logic
├── middleware/
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Request validation rules
├── models/
│   ├── Cart.js            # Cart and CartItem schemas
│   ├── Product.js         # Product schema
│   └── User.js            # User schema
└── routes/
    └── cartRoutes.js      # Cart API routes
scripts/
└── seedData.js            # Database seeding script
server.js                  # Main application entry point
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/health

# Get cart
curl http://localhost:5000/get-cart/user123

# Add to cart (you'll need a real product ID from seeded data)
curl -X POST http://localhost:5000/add-to-cart \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","productId":"PRODUCT_ID_HERE","quantity":2}'
```

### Using Frontend

The API is configured to work seamlessly with the React frontend. Make sure both services are running:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 🔍 Database Schema

### Product Schema

```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required, min: 0),
  image: String (required),
  category: String (required, enum),
  inStock: Boolean (default: true),
  stockQuantity: Number (default: 100)
}
```

### Cart Schema

```javascript
{
  userId: String (required, indexed),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number (min: 1, max: 50),
    addedAt: Date (default: now)
  }],
  totalPrice: Number (calculated automatically)
}
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm run seed` - Seed database with sample data
- `npm test` - Run test suite (tests to be implemented)

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin request handling
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Secure error responses (no sensitive data leak)
- **MongoDB Injection Protection**: Mongoose built-in protection

## 📊 Performance Features

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: MongoDB connection pooling
- **Request Size Limiting**: 10MB limit on request bodies
- **Efficient Population**: Only necessary fields populated

## 🚀 Deployment

### Environment Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Configure proper CORS origins
4. Set up proper logging
5. Use PM2 or similar for process management

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔮 Future Enhancements

- **Authentication**: JWT-based user authentication
- **Rate Limiting**: API rate limiting middleware
- **Caching**: Redis integration for cart caching
- **Webhooks**: Event-driven architecture with other services
- **Analytics**: Cart abandonment tracking
- **Testing**: Comprehensive test suite with Jest
- **Documentation**: Swagger/OpenAPI documentation
- **Monitoring**: Health checks and metrics

## 🤝 Integration with Frontend

This backend is designed to work with the React frontend located at:
`/home/eugenius/Documents/Eugenius/Projects/Brave Redemptive/Week 1/Brave-Bedemptive-E-commerce-Checkout-Frotend`

The frontend expects:
- Backend running on `http://localhost:5000`
- All endpoints responding with the documented JSON format
- CORS configured for `http://localhost:3000`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   
   # Check connection string in .env file
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill the process or change PORT in .env
   ```

3. **CORS Issues**
   ```bash
   # Verify FRONTEND_URL in .env matches your frontend URL
   ```

## 📞 Support

For questions or issues:

- **Developer**: Eugene - Brave Redemptive
- **Repository**: [Backend Repository Link]

---

**Note**: This cart service is part of a larger microservices architecture. For complete functionality, ensure the frontend application is also running and properly configured.
