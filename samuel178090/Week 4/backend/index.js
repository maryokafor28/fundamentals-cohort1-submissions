const express = require("express")
const path = require("path")
const {connect} = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const upload = require("express-fileupload")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const mongoSanitize = require('express-mongo-sanitize');
const {notFound, errorHandler} = require('./middleware/errorMiddleware')
const {generalLimiter, authLimiter} = require('./middleware/rateLimiter')
// const {sanitizeInput} = require('./middleware/sanitizer') // Removed
const logger = require('./utils/logger')

const router = require('./routes/routes')
const {server, app} = require("./socket/socket");



// CORS MUST BE FIRST
app.use(cors({
  credentials: true, 
  origin: [
    "http://localhost:5173", 
    "http://localhost:5175", 
    "http://localhost:3000",
    "https://developerspac.netlify.app",
    /\.netlify\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsers BEFORE other middleware
app.use(express.urlencoded({extended: true, limit: '10mb'}))
app.use(express.json({extended: true, limit: '10mb'}))
app.use(upload({limits: { fileSize: 5 * 1024 * 1024 }}))
app.use(cookieParser());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// app.use(mongoSanitize()); // Disabled for Express 5 compatibility
// app.use(sanitizeInput); // Temporarily disabled

// Apply rate limiters
app.use(generalLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/users/login', authLimiter);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', router); // Changed from 'routes'

// Error handlers
app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      logger.info(`Server is running on port ${process.env.PORT || 5000}`);
      console.log(`✅ Server is running on port ${process.env.PORT || 5000}`);
    });
    logger.info('MongoDB connected successfully ✅');
    console.log('MongoDB connected successfully ✅');
  })
  .catch(err => {
    logger.error('MongoDB connection failed ❌', err);
    console.log('MongoDB connection failed ❌');
    console.log(err);
    process.exit(1);
  });