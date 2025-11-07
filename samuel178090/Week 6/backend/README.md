# FlowServe Backend API

Backend URL: https://flowserve-api.onrender.com
Frontend URL: https://paymentplatform.netlify.app/
 Admin Login:
Option 1 (Email):
Email field: admin@flowserve.com
Password field: admin123

Option 2 (Phone):
Phone field: 01000000000
Password field: admin123

User Login:
Option 1 (Email):
Email field: john.doe@example.com
Password field: password123

Option 2 (Phone):
Phone field: 01234567890
Password field: password123

How to Login:
Go to login page
Enter EITHER email OR phone in the appropriate field
Enter password in password field Click login
A scalable and reliable Node.js backend API for digital payment processing and wallet operations.

## 🏗️ Architecture

- **Framework**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role support
- **Security**: Rate limiting, input validation, CORS protection
- **Logging**: Winston with file rotation
- **Validation**: Joi schema validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flowserve-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Start the server**
   ```bash
   # Development mode (with mock data)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/health` - Auth service health

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/phone/:phone` - Check if phone exists
- `GET /api/users/transactions` - Get user transactions
- `GET /api/users/money-spent` - Get spending statistics

### Transactions
- `POST /api/transactions/send-money/phone` - Send money by phone
- `POST /api/transactions/send-money/username` - Send money by username
- `POST /api/transactions/request-money/phone` - Request money by phone

### Funds Management
- `GET /api/funds/cash/service-code` - Get Fawry service code
- `POST /api/funds/cash/add-funds` - Add funds via cash
- `POST /api/funds/credit/add-funds` - Add funds via credit card

### Virtual Credit Cards
- `POST /api/vcc/generate` - Generate new VCC
- `POST /api/vcc/use` - Use VCC for payment
- `GET /api/vcc/limits` - Get VCC limits

### Dashboard
- `GET /api/dashboard/data` - Get comprehensive dashboard data

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/flowserve_db"

# JWT
JWT_KEY="your-secure-jwt-key"

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# External APIs
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
XRapidAPIKey="your-rapidapi-key"

# Security
BCRYPT_SALT_ROUNDS=12
JWT_EXPIRY_HOURS=24
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Configurable per endpoint
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt with salt
- **CORS Protection**: Configurable origins
- **Request Logging**: Comprehensive audit trails

## 📊 Database Schema

### Core Tables
- `users` - User accounts and profiles
- `transactions` - Financial transactions
- `virtual_credit_cards` - Temporary credit cards
- `notifications` - User notifications
- `audit_logs` - Security logging

## 🧪 Testing

### Mock Mode
The application includes a mock mode for development:

```bash
npm run dev  # Starts with mock database
```

**Test Credentials:**
- Phone: `01234567890`
- Password: `password123`

### API Testing
Use the provided Postman collection for comprehensive API testing.

## 📈 Monitoring

### Health Checks
- `GET /health` - Overall system health
- `GET /api/auth/health` - Authentication service
- `GET /api/users/health` - User service

### Logging
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console output in development

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT_KEY
4. Configure CORS for production domain
5. Set up SSL/TLS

### Environment-specific configs
- `.env.development` - Development settings
- `.env.production` - Production settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
Gmail: josephsammy1994@gmail.com

## 🆘 Support

For issues and questions:
- Create GitHub issues
- Check API documentation
- Review logs for debugging

## 🔮 Roadmap

- [ ] GraphQL API support
- [ ] Microservices architecture
- [ ] Advanced analytics
- [ ] Multi-currency support
- [ ] Webhook system
- [ ] API versioning
