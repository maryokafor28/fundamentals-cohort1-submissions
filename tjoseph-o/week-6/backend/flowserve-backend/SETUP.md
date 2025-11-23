# Quick Setup Guide - FlowServe Backend

## Prerequisites Check

```bash
# Check Node.js version (should be v16+)
node --version

# Check npm version
npm --version

# Check PostgreSQL version (should be v12+)
psql --version
```

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Express.js - Web framework
- Sequelize - ORM
- PostgreSQL drivers
- Jest & Supertest - Testing
- Winston - Logging
- Joi - Validation
- And more...

### 2. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE flowserve_db;

# Create test database (for running tests)
CREATE DATABASE flowserve_db_test;

# Exit
\q
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
# Update DB_USER, DB_PASSWORD, etc.
```

### 4. Run Tests (TDD Approach)

```bash
# Run all tests - they should pass!
npm test

# Expected output:
# ✓ All setup tests pass
# ✓ Database connection works
# ✓ Express app configured correctly
# ✓ Logger initialized
```

### 5. Start Development Server

```bash
# Start with auto-reload
npm run dev

# You should see:
# ✓ Database connection established successfully.
# 🚀 FlowServe API server running on port 5000
```

### 6. Test the API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "uptime": 5.123
# }
```

## Troubleshooting

### Database Connection Issues

**Error**: "Unable to connect to the database"

**Solution**:
```bash
# 1. Check if PostgreSQL is running
sudo service postgresql status

# 2. Start PostgreSQL if not running
sudo service postgresql start

# 3. Verify credentials in .env file
# 4. Ensure database exists
psql -U postgres -l
```

### Port Already in Use

**Error**: "Port 5000 is already in use"

**Solution**:
```bash
# Change PORT in .env file to a different port
PORT=5001
```

### Test Failures

**Error**: Tests failing

**Solution**:
```bash
# 1. Ensure test database exists
psql -U postgres -c "CREATE DATABASE flowserve_db_test;"

# 2. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Run tests with verbose output
npm test -- --verbose
```

## Next Steps

After completing setup:

1. ✅ Phase 1.1 Complete - Backend Foundation
2. ⏭️ Phase 1.2 - Create Database Models (User, Transaction)
3. ⏭️ Phase 2.1 - Build User Management APIs
4. ⏭️ Phase 2.2 - Build Transaction APIs

## Verification Checklist

- [ ] Node.js installed (v16+)
- [ ] PostgreSQL installed and running
- [ ] Dependencies installed (`node_modules` exists)
- [ ] `.env` file created and configured
- [ ] Databases created (flowserve_db, flowserve_db_test)
- [ ] All tests passing (`npm test`)
- [ ] Server starts successfully (`npm run dev`)
- [ ] Health endpoint responds (`curl http://localhost:5000/health`)

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with auto-reload
npm start                # Start production server

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm test -- --coverage   # Run tests with coverage report

# Database
npm run db:migrate       # Run database migrations
npm run db:migrate:undo  # Rollback last migration
npm run db:seed          # Seed database with sample data

# Code Quality
npm run lint             # Check code style
```

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review the main README.md
3. Check test output for specific errors
4. Ensure all prerequisites are met

---

**You're ready to start building! 🚀**