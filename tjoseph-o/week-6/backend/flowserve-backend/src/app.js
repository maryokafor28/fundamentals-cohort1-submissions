const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const logger = require('./config/logger');
const rateLimit = require('express-rate-limit');

const app = express();

const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const { errorHandler, notFound } = require('./middleware/error');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the maximum number of requests. Please try again later.'
  }
});

app.use('/api/', apiLimiter);