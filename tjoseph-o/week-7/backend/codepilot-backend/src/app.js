const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');


const authRoutes = require('./modules/auth/auth.routes');
const productRoutes = require('./modules/products/products.routes');
const orderRoutes = require('./modules/orders/orders.routes');

const app = express();


app.use(helmet());
app.use(cors());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});


app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});


app.use(`/api/${config.api.version}/auth`, authRoutes);
app.use(`/api/${config.api.version}/products`, productRoutes);
app.use(`/api/${config.api.version}/orders`, orderRoutes);


app.use(notFoundHandler);


app.use(errorHandler);

module.exports = app;