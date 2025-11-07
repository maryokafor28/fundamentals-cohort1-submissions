# QDACK E-commerce Backend API

A scalable microservices-based backend built with NestJS, MongoDB, and TypeScript for the QDACK e-commerce platform.
Url = https://qdacf.netlify.app/ Admin email: admin@example.com password: admin123
 Customer email: customer@example.com password: customer123

## 🏗️ Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   API GATEWAY                               │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • NestJS Application (Port 3100)                           │ │
│  │ • CORS Configuration                                        │ │
│  │ • CSRF Protection                                           │ │
│  │ • JWT Authentication Middleware                             │ │
│  │ • Request Validation                                        │ │
│  │ • Rate Limiting                                             │ │
│  │ • Swagger Documentation                                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                   │                             │
│                    ┌──────────────┼──────────────┐              │
│                    ▼              ▼              ▼              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│  │  USER SERVICE   │ │ PRODUCT SERVICE │ │  ORDER SERVICE  │    │
│  ├─────────────────┤ ├─────────────────┤ ├─────────────────┤    │
│  │ • Authentication│ │ • CRUD Operations│ │ • Checkout      │    │
│  │ • Registration  │ │ • Search & Filter│ │ • Order History │    │
│  │ • JWT Tokens    │ │ • Categories     │ │ • Payment       │    │
│  │ • User Profile  │ │ • Image Upload   │ │ • Status Update │    │
│  │ • Email Verify  │ │ • SKU Management │ │ • Validation    │    │
│  │ • Password Mgmt │ │ • License Keys   │ │ • Webhooks      │    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│           │                       │                       │     │
│           └───────────────────────┼───────────────────────┘     │
│                                   │                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 SHARED MODULES                              │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • Database Repositories                                     │ │
│  │ • MongoDB Schemas                                           │ │
│  │ • Validation DTOs                                           │ │
│  │ • Guards & Decorators                                       │ │
│  │ • Utility Functions                                         │ │
│  │ • Seed Data Service                                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB (Port 27017)                                          │
│  ├── users (User profiles, authentication)                     │
│  ├── products (Product catalog, SKUs, images)                  │
│  ├── orders (Order history, checkout data)                     │
│  └── licenses (Product license keys)                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mservice

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# See Environment Configuration section below
```

### Environment Configuration

Create `.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/qdack-ecommerce

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Server
PORT=3100
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas connection string in .env
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qdack-ecommerce
```

### Development Server

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

The API will be available at `http://localhost:3100`

### Seed Initial Data

```bash
# Seed all data (users + products)
curl -X POST http://localhost:3100/api/v1/seed/all

# Seed only products
curl -X POST http://localhost:3100/api/v1/seed/products

# Seed only users
curl -X POST http://localhost:3100/api/v1/seed/users
```

## 📁 Project Structure

```
mservice/
├── src/
│   ├── users/                   # User Service
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── users.controller.ts  # User endpoints
│   │   ├── users.service.ts     # User business logic
│   │   └── users.module.ts      # User module
│   ├── products/                # Product Service
│   │   ├── dto/                 # Product DTOs
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   ├── orders/                  # Order Service
│   │   ├── dto/                 # Order DTOs
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── orders.module.ts
│   ├── shared/                  # Shared Resources
│   │   ├── schema/              # MongoDB schemas
│   │   ├── repositories/        # Database repositories
│   │   ├── guards/              # Authentication guards
│   │   ├── decorators/          # Custom decorators
│   │   └── seeds/               # Database seeding
│   ├── app.module.ts           # Main application module
│   ├── main.ts                 # Application bootstrap
│   └── responseinterceptor.ts  # Response formatting
├── config/                     # Configuration files
├── package.json               # Dependencies and scripts
└── .env                       # Environment variables
```

## 📚 API Documentation

### Base URL
```
http://localhost:3100/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "type": "customer"
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout User
```http
PUT /users/logout
Authorization: Bearer <jwt-token>
```

#### Verify Email
```http
GET /users/verify-email/{otp}/{email}
```

### Product Endpoints

#### Get All Products
```http
GET /products
Query Parameters:
- search: string (optional) - Search term
- platformType: string (optional) - iOS, Android, Mac, Windows, Linux
- baseType: string (optional) - Computer, Mobile
- category: string (optional) - Application Software, Operating System
- limit: number (optional) - Results per page (default: 10)
- offset: number (optional) - Skip results (default: 0)
- sort: string (optional) - Sort field (-createdAt, -avgRating, price, -price)
```

#### Get Homepage Products
```http
GET /products?homepage=true
```

#### Get Single Product
```http
GET /products/{id}
```

#### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "productName": "Adobe Photoshop",
  "description": "Professional photo editing software",
  "category": "Application Software",
  "platformType": "Windows",
  "baseType": "Computer",
  "productUrl": "https://adobe.com/photoshop",
  "downloadUrl": "https://adobe.com/downloads/photoshop",
  "image": "https://example.com/image.jpg",
  "highlights": ["Photo Editing", "Digital Art"],
  "requirementSpecification": [
    {"name": "OS", "value": "Windows 10 or later"},
    {"name": "Memory", "value": "8GB RAM"}
  ],
  "skuDetails": [
    {
      "price": 249,
      "validity": 365,
      "lifetime": false,
      "stripePriceId": "price_photoshop"
    }
  ]
}
```

#### Update Product (Admin Only)
```http
PUT /products/{id}
Authorization: Bearer <admin-jwt-token>
```

#### Delete Product (Admin Only)
```http
DELETE /products/{id}
Authorization: Bearer <admin-jwt-token>
```

### Order Endpoints

#### Get User Orders
```http
GET /orders
Authorization: Bearer <jwt-token>
Query Parameters:
- status: string (optional) - pending, completed, cancelled
- limit: number (optional)
- offset: number (optional)
```

#### Create Checkout Session
```http
POST /orders/checkout
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "checkoutDetails": [
    {
      "productId": "product-id",
      "skuId": "sku-id",
      "skuPriceId": "stripe-price-id",
      "quantity": 1,
      "price": 249,
      "productName": "Adobe Photoshop",
      "productImage": "https://example.com/image.jpg",
      "lifetime": false,
      "validity": 365
    }
  ]
}
```

#### Get Single Order
```http
GET /orders/{id}
Authorization: Bearer <jwt-token>
```

### Utility Endpoints

#### Get CSRF Token
```http
GET /csrf-token
```

#### Seed Database
```http
POST /seed/all
POST /seed/products
POST /seed/users
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Role-based Access**: Admin and customer roles
- **Token Expiration**: Configurable token lifetime

### Security Middleware
- **CSRF Protection**: Cross-site request forgery prevention
- **CORS Configuration**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Rate Limiting**: API rate limiting protection
- **Input Validation**: Comprehensive request validation

### Data Protection
- **Secure Cookies**: HTTP-only cookies for sensitive data
- **Environment Variables**: Sensitive data in environment files
- **MongoDB Security**: Connection string protection
- **Error Handling**: Secure error messages

## 🗄️ Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  type: 'customer' | 'admin',
  isEmailVerified: boolean,
  emailVerificationOTP: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```typescript
{
  _id: ObjectId,
  productName: string,
  description: string,
  image: string,
  category: string,
  platformType: string,
  baseType: string,
  productUrl: string,
  downloadUrl: string,
  avgRating: number,
  skuDetails: [{
    price: number,
    validity: number,
    lifetime: boolean,
    stripePriceId: string,
    createdAt: Date,
    updatedAt: Date
  }],
  requirementSpecification: [{
    name: string,
    value: string
  }],
  highlights: [string],
  feedbackDetails: [{
    customerId: ObjectId,
    customerName: string,
    rating: number,
    feedbackMsg: string,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    skuId: ObjectId,
    quantity: number,
    price: number,
    productName: string
  }],
  totalAmount: number,
  status: 'pending' | 'completed' | 'cancelled',
  billingInfo: {
    name: string,
    email: string,
    phone: string,
    address: string
  },
  paymentInfo: {
    method: string,
    transactionId: string,
    status: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Manual API Testing

#### Test Authentication
```bash
# Register new user
curl -X POST http://localhost:3100/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","type":"customer"}'

# Login user
curl -X POST http://localhost:3100/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### Test Product Search
```bash
# Search products
curl "http://localhost:3100/api/v1/products?search=adobe"

# Filter by platform
curl "http://localhost:3100/api/v1/products?platformType=iOS"

# Get homepage products
curl "http://localhost:3100/api/v1/products?homepage=true"
```

### Test User Accounts
```bash
# Admin Account
Email: admin@example.com
Password: admin123

# Customer Account
Email: customer@example.com
Password: customer123
```

## 🚀 Deployment

### Production Environment
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qdack-ecommerce
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
PORT=3100
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3100
CMD ["npm", "run", "start:prod"]
```

## 📊 Monitoring & Logging

### API Documentation
- **Swagger UI**: Available at `/api/docs` in development
- **OpenAPI Spec**: Auto-generated API documentation
- **Interactive Testing**: Test endpoints directly from docs

### Logging
- **Request Logging**: All API requests logged
- **Error Logging**: Comprehensive error tracking
- **Performance Monitoring**: Response time tracking

## 📚 Relevant Links

- **NestJS Documentation**: https://docs.nestjs.com/
- **MongoDB Documentation**: https://docs.mongodb.com/
- **Mongoose ODM**: https://mongoosejs.com/docs/
- **JWT Authentication**: https://jwt.io/
- **Swagger/OpenAPI**: https://swagger.io/docs/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using NestJS and MongoDB**