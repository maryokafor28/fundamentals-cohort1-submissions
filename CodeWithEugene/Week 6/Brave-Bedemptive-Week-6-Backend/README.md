# FlowServe Backend

A robust Node.js backend application built with Express.js and PostgreSQL, featuring user management and transaction processing capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Management**: Create and manage user accounts with email validation
- **Transaction Processing**: Handle credit and debit transactions with status tracking
- **Balance Management**: Automatic balance calculation and updates
- **Security**: 
  - Helmet.js for security headers
  - Rate limiting to prevent abuse
  - CORS configuration
  - Input validation with Joi
- **Logging**: Comprehensive logging with Winston
- **Database**: PostgreSQL with Sequelize ORM
- **Testing**: Jest test framework with Supertest
- **Code Quality**: ESLint and Prettier for code consistency

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Validation**: Joi
- **Security**: Helmet, express-rate-limit, CORS
- **Logging**: Winston, Morgan
- **Testing**: Jest, Supertest
- **Dev Tools**: Nodemon, ESLint, Prettier

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Brave-Bedemptive-Week-6-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## ⚙️ Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   DATABASE_URL=postgres://postgres:password@localhost:5432/flowserve_db
   NODE_ENV=development
   RATE_LIMIT_MAX=100
   API_KEY=your_api_key_here
   ```

   **Environment Variables:**
   - `PORT`: Server port (default: 5000)
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: Environment mode (development/test/production)
   - `RATE_LIMIT_MAX`: Maximum requests per window
   - `API_KEY`: API authentication key

## 🗄️ Database Setup

1. **Create PostgreSQL database**
   ```bash
   createdb flowserve_db
   ```

2. **Run migrations**
   ```bash
   npm run db:migrate
   ```

3. **Seed database (optional)**
   ```bash
   npm run db:seed
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Runs the server with nodemon for auto-restart on file changes.

### Production Mode
```bash
npm start
```
Runs the server in production mode.

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Documentation

### Models

#### User Model
- `id`: UUID (Primary Key)
- `name`: String (Required)
- `email`: String (Required, Unique, Valid Email)
- `balance`: Decimal(15,2) (Default: 0.00)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### Transaction Model
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key → User)
- `type`: ENUM('credit', 'debit')
- `amount`: Decimal(15,2) (Min: 0)
- `status`: ENUM('pending', 'successful', 'failed') (Default: 'pending')
- `timestamp`: Date (Default: NOW)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Relationships
- A User can have many Transactions
- A Transaction belongs to one User (CASCADE on delete/update)

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The tests run with:
- Jest in band mode (sequential execution)
- NODE_ENV set to 'test'
- Experimental VM modules enabled

## 📁 Project Structure

```
Brave-Bedemptive-Week-6-Backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Database configuration
│   │   └── logger.js        # Winston logger setup
│   ├── models/
│   │   ├── User.js          # User model definition
│   │   ├── Transaction.js   # Transaction model definition
│   │   └── index.js         # Model associations
│   └── server.js            # Application entry point
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── .sequelizerc            # Sequelize CLI configuration
├── sequelize.config.cjs    # Sequelize database config
├── package.json            # Project dependencies
├── LICENSE                 # MIT License
└── README.md              # Project documentation
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint on codebase |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with initial data |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint rules configured in the project
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Eugene Mutembei

## 👨‍💻 Author

**Eugene Mutembei**

---

## 🔒 Security

- All passwords should be hashed using bcrypt
- API keys should never be committed to version control
- Use environment variables for sensitive data
- Rate limiting is enabled to prevent abuse
- Helmet.js provides security headers

## 📝 Notes

- The application uses ES Modules (`"type": "module"` in package.json)
- Database timestamps are automatically managed by Sequelize
- UUIDs are used for primary keys for better scalability
- Decimal values are automatically formatted to 2 decimal places
- All foreign key relationships use CASCADE for updates and deletes

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correctly formatted
- Check database credentials and permissions

### Migration Errors
- Ensure database exists before running migrations
- Check Sequelize CLI configuration in `.sequelizerc`

### Port Already in Use
- Change PORT in `.env` file
- Kill the process using the port: `lsof -ti:5000 | xargs kill`

---

**Happy Coding! 🚀**
