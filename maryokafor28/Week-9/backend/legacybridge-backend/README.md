# LegacyBridge Backend Integration Service

## 🎯 Project Overview

**LegacyBridge Backend** is a Node.js integration service built with Express and TypeScript that bridges the gap between legacy payment systems and modern API architectures. This service acts as an intermediary layer, consuming data from legacy APIs and exposing versioned RESTful endpoints with enhanced reliability and performance.

---

## 🔗 Quick Links

- **Deployed API**: [https://legacybridge-backend.onrender.com](https://legacybridge-backend.onrender.com)
- **Postman Documentation**: [API Collection](https://documenter.getpostman.com/view/48798242/2sB3dHUsc6)
- **Test Coverage**: See [Coverage Report](#-test-coverage-report) below

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [API Flow Diagram](#-api-flow-diagram)
- [Legacy API Assumptions](#-legacy-api-assumptions)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Setup Guide](#-setup-guide)
- [API Endpoints](#-api-endpoints)
- [Test Coverage Report](#-test-coverage-report)
- [Deployment](#-deployment)

---

## 🏗️ Architecture Overview

The LegacyBridge service follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                    API Consumers                         │
│         (Postman, cURL, Integration Partners)           │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  LegacyBridge Service                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │         API Layer (v1 & v2 Endpoints)           │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │      Controllers (Request Handling Layer)       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Services (Business Logic & Integration)      │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │      Utilities (Caching, Retry, Error)          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Legacy Payment System API                   │
│           (JSONPlaceholder Mock API)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 API Flow Diagram

### Request Flow Architecture

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ HTTP Request
     ↓
┌────────────────────────────────────────────────┐
│         Express Server (Port 5000)              │
│  ┌──────────────────────────────────────────┐ │
│  │     Logger Middleware (Request Log)      │ │
│  └──────────────────┬───────────────────────┘ │
│                     ↓                          │
│  ┌──────────────────────────────────────────┐ │
│  │      Route Handler (v1 or v2)            │ │
│  │  • /api/v1/customers                     │ │
│  │  • /api/v1/payments                      │ │
│  │  • /api/v2/customers                     │ │
│  │  • /api/v2/payments                      │ │
│  └──────────────────┬───────────────────────┘ │
│                     ↓                          │
│  ┌──────────────────────────────────────────┐ │
│  │         Controller Layer                 │ │
│  │  • Validate Request                      │ │
│  │  • Call Service Layer                    │ │
│  └──────────────────┬───────────────────────┘ │
│                     ↓                          │
│  ┌──────────────────────────────────────────┐ │
│  │          Service Layer                   │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │   1. Check Cache (Memory)          │ │ │
│  │  └──────────┬─────────────────────────┘ │ │
│  │             ↓ (Cache Miss)               │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │   2. Call Legacy API Service       │ │ │
│  │  │      • Retry Logic (3 attempts)    │ │ │
│  │  │      • Timeout Handling (5s)       │ │ │
│  │  └──────────┬─────────────────────────┘ │ │
│  │             ↓                             │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │   3. Format Response               │ │ │
│  │  │      • V1 includes geo coordinates │ │ │
│  │  │      • V2 excludes geo object      │ │ │
│  │  └──────────┬─────────────────────────┘ │ │
│  │             ↓                             │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │   4. Cache Result (TTL: 5min)      │ │ │
│  │  └──────────┬─────────────────────────┘ │ │
│  └─────────────┼─────────────────────────────┘ │
│                ↓                                │
│  ┌──────────────────────────────────────────┐  │
│  │      Error Middleware (if error)         │  │
│  │  • Custom Error Handling                 │  │
│  │  • Structured Error Response             │  │
│  └──────────────────┬───────────────────────┘  │
└───────────────────┬─┴────────────────────────────┘
                    ↓
              ┌──────────┐
              │ Response │
              │   JSON   │
              └──────────┘
```

### Version Differences

```
┌────────────────────────────────────────────────────┐
│            Legacy API Response Format               │
│  (JSONPlaceholder - camelCase naming convention)   │
│  {                                                  │
│    "id": 1,                                        │
│    "name": "Leanne Graham",                        │
│    "username": "Bret",                             │
│    "email": "Sincere@april.biz",                   │
│    "address": {                                    │
│      "street": "Kulas Light",                      │
│      "suite": "Apt. 556",                          │
│      "city": "Gwenborough",                        │
│      "zipcode": "92998-3874",                      │
│      "geo": {                                      │
│        "lat": "-37.3159",                          │
│        "lng": "81.1496"                            │
│      }                                              │
│    },                                               │
│    "phone": "1-770-736-8031 x56442",              │
│    "website": "hildegard.org",                     │
│    "company": { ... }                              │
│  }                                                  │
└─────────────────────┬──────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ↓                           ↓
┌────────────────────┐    ┌────────────────────┐
│   V1 Response      │    │   V2 Response      │
│ (includes geo)     │    │ (excludes geo)     │
│                    │    │                    │
│ address: {         │    │ address: {         │
│   street: "...",   │    │   street: "...",   │
│   suite: "...",    │    │   suite: "...",    │
│   city: "...",     │    │   city: "...",     │
│   zipcode: "...",  │    │   zipcode: "..."   │
│   geo: {           │    │ }                  │
│     lat: "...",    │    │                    │
│     lng: "..."     │    │                    │
│   }                │    │                    │
│ }                  │    │                    │
└────────────────────┘    └────────────────────┘
```

---

## 📝 Legacy API Assumptions

### Critical Assumptions About Legacy System Behavior

The integration layer was built with the following assumptions about the legacy system (represented by JSONPlaceholder API):

#### 1. **API Endpoint Structure**

- **Assumption**: Legacy API follows RESTful patterns with base URL structure
- **Expected Resources**:
  - `/users` - Customer/User management
  - `/posts` - Payment/Transaction data (simulated)
- **HTTP Methods**: Primarily GET requests
- **Authentication**: No authentication required for the mock API

#### 2. **Data Format & Naming Conventions**

- **Response Format**: JSON with camelCase naming convention (e.g., `catchPhrase`, `username`)
- **Date Formats**: Not provided by JSONPlaceholder
- **Field Structure**: Both V1 and V2 endpoints return JSONPlaceholder's camelCase format
  - **V1**: Includes full address with `geo` coordinates object
  - **V2**: Excludes `geo` object from address for streamlined responses

#### 3. **Response Structure**

- **Success Response**: Direct data return without wrapper objects from JSONPlaceholder
  ```json
  // JSONPlaceholder Response (wrapped by our service)
  {
    "id": 1,
    "name": "Leanne Graham",
    "email": "Sincere@april.biz",
    "phone": "1-770-736-8031 x56442",
    "username": "Bret",
    "address": {
      "street": "Kulas Light",
      "city": "Gwenborough",
      "geo": { "lat": "-37.3159", "lng": "81.1496" }
    },
    "website": "hildegard.org",
    "company": { ... }
  }
  ```
- **List Responses**: Arrays returned directly, no pagination
- **Null Handling**: Missing fields omitted entirely

#### 4. **Performance Characteristics**

- **Response Time**: Assumes average response time of 200ms-500ms (JSONPlaceholder is fast)
- **Timeout Threshold**: Set to 5 seconds
- **Rate Limiting**: No strict rate limits on JSONPlaceholder; caching reduces requests
- **Concurrent Requests**: Handles high concurrency well

#### 5. **Reliability & Error Behavior**

- **Intermittent Failures**: Minimal failures expected from JSONPlaceholder
- **Network Issues**: Connection timeouts handled with retry logic
- **Error Codes**: Standard HTTP status codes (200, 404, 500)
- **Retry Strategy**: Exponential backoff with 3 retry attempts

#### 6. **Data Consistency**

- **Stale Data**: Data is static; 5-minute cache TTL is acceptable
- **Partial Updates**: Not applicable (read-only mock API)
- **Data Validation**: No validation on JSONPlaceholder side; validation added in integration layer

#### 7. **API Versioning**

- **No Versioning**: JSONPlaceholder has no versioning scheme
- **Breaking Changes**: Not expected (stable mock API)
- **Backward Compatibility**: Service maintains compatibility through dual versioning (v1/v2)
  - V1 and V2 differ only in address field structure (geo coordinates included vs excluded)

#### 8. **Availability & Maintenance**

- **Uptime**: 99%+ availability (reliable mock service)
- **Maintenance Windows**: Minimal downtime expected
- **Monitoring**: Health checks implemented on service layer

#### 10. **Security Assumptions**

- **HTTPS**: HTTPS available
- **Data Sensitivity**: Mock data, not sensitive
- **CORS**: CORS configured on service layer

### Mitigation Strategies Implemented

Based on these assumptions, the following strategies were implemented:

1. **Retry Mechanism**: Exponential backoff with 3 attempts
2. **Timeout Handling**: 5-second timeout with graceful error messages
3. **Response Caching**: In-memory cache with 5-minute TTL
4. **Version Support**: V1 (with geo) and V2 (without geo) for different client needs
5. **Error Normalization**: Standardized error responses regardless of upstream errors
6. **Input Validation**: Server-side validation before forwarding requests
7. **Health Monitoring**: Regular health checks on API availability

---

## ✨ Features

- ✅ **Dual API Versioning** - Support for v1 and v2 endpoints with format variations
- ✅ **Flexible Data Format** - V1 includes geo-coordinates, V2 provides streamlined address format
- ✅ **Intelligent Caching** - In-memory caching with configurable TTL (5 minutes default)
- ✅ **Retry Logic** - Automatic retry with exponential backoff (3 attempts)
- ✅ **Error Handling** - Comprehensive error handling with structured responses
- ✅ **Request Logging** - Detailed request/response logging for debugging
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Test Coverage** - 87.57% statement coverage with 97 passing tests
- ✅ **CORS Support** - Configured for cross-origin requests
- ✅ **Health Checks** - API health monitoring endpoints

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Testing**: Jest (97 tests passing)
- **Caching**: In-memory cache
- **HTTP Client**: Axios
- **Validation**: Zod
- **Deployment**: Render.com

---

## 🚀 Setup Guide

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

### Local Development Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/legacybridge-backend.git
   cd legacybridge-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # Application Configuration
   PORT=5000
   NODE_ENV=development

   # Legacy API Configuration
   LEGACY_API_BASE_URL=https://jsonplaceholder.typicode.com
   LEGACY_API_KEY=
   LEGACY_API_TIMEOUT=5000

   # Cache Configuration
   CACHE_TTL=300
   CACHE_ENABLED=true
   CACHE_MAX_SIZE=100

   # Logging
   LOG_LEVEL=info

   # Security & Rate Limiting
   API_RATE_LIMIT_WINDOW=15
   API_RATE_LIMIT_MAX=100

   # CORS Configuration
   CORS_ORIGINS=http://localhost:5173

   # API Versioning
   API_VERSION_PREFIX=/api
   DEFAULT_API_VERSION=v2

   # Retry Configuration
   MAX_RETRY_ATTEMPTS=3
   RETRY_DELAY=1000
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:5000`

5. **Run Tests**

   ```bash
   # Run all tests
   npm test

   # Run unit tests only
   npm run test:unit

   # Run integration tests only
   npm run test:integration

   # Run tests with coverage
   npm run test:coverage
   ```

6. **Build for Production**

   ```bash
   npm run build
   ```

7. **Start Production Server**
   ```bash
   npm start
   ```

---

## 📡 API Endpoints

### Version 1 Endpoints (Includes Geo Coordinates)

#### Customers

- `GET /api/v1/customers` - List all customers (includes address.geo)
- `GET /api/v1/customers/:id` - Get customer by ID (includes address.geo)

#### Payments

- `GET /api/v1/payments` - List all payments (includes address.geo)
- `GET /api/v1/payments/:id` - Get payment by ID (includes address.geo)

### Version 2 Endpoints (Streamlined Address Format)

#### Customers

- `GET /api/v2/customers` - List customers (excludes address.geo)
- `GET /api/v2/customers/:id` - Get customer (excludes address.geo)

#### Payments

- `GET /api/v2/payments` - List payments (excludes address.geo)
- `GET /api/v2/payments/:id` - Get payment (excludes address.geo)

### Example Request/Response

**V1 Request (With Geo Coordinates):**

```http
GET /api/v1/customers/1 HTTP/1.1
Host: legacybridge-backend.onrender.com
```

**V1 Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  }
}
```

**V2 Request (Streamlined Format):**

```http
GET /api/v2/customers/1 HTTP/1.1
Host: legacybridge-backend.onrender.com
```

**V2 Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Leanne Graham",
    "email": "Sincere@april.biz",
    "phone": "1-770-736-8031 x56442",
    "username": "Bret",
    "website": "hildegard.org",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874"
    },
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  }
}
```

**Key Differences:**

- **V1**: Includes `address.geo` object with `lat` and `lng` coordinates
- **V2**: Excludes `address.geo` object for a more streamlined response
- Field ordering may vary slightly between versions

---

## 📊 Test Coverage Report

### Overall Coverage Summary

| Metric         | Coverage | Status  |
| -------------- | -------- | ------- |
| **Statements** | 87.57%   | ✅ Good |
| **Branches**   | 62.63%   | ⚠️ Fair |
| **Functions**  | 80.95%   | ✅ Good |
| **Lines**      | 87.54%   | ✅ Good |

### Test Suite Summary

```
Test Suites: 10 passed, 10 total
Tests:       97 passed, 97 total
Snapshots:   0 total
Time:        8.402 s
```

#### Test Distribution

- **Unit Tests**: 6 suites (40 tests)
  - Service layer tests
  - Transformer tests
  - Utility tests
- **Integration Tests**: 4 suites (57 tests)
  - v1 Customer endpoints
  - v1 Payment endpoints
  - v2 Customer endpoints
  - v2 Payment endpoints

### Running Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

---

## 🌐 Deployment

### Deployment on Render

1. **Connect Repository**

   - Link GitHub repository to Render
   - Select `legacybridge-backend` repository

2. **Configure Build Settings**

   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables**

   - Add all required environment variables from `.env`
   - Ensure `NODE_ENV=production`

4. **Deploy**
   - Automatic deployments on git push
   - Manual deploy via Render dashboard

### Health Check Endpoint

```http
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "uptime": 123456
}
```

---

## 📚 Additional Documentation

- **Postman Collection**: [View API Documentation](https://documenter.getpostman.com/view/48798242/2sB3dHUsc6)
- **GitHub Repository**: [Source Code](https://github.com/yourusername/legacybridge-backend)

---

## 👨‍💻 Author

Mary Amadi

**Brave Challenge Submission**  
Built as part of the LegacyBridge Backend Integration challenge

---

## 🙏 Acknowledgments

- Brave Redemptive for the challenge framework
- JSONPlaceholder for providing a free mock API for testing

---

**Last Updated**: November 21, 2025
