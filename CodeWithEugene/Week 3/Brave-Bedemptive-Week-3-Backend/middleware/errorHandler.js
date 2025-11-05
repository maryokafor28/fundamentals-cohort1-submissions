/**
 * Global error handling middleware
 */

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB validation errors
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => err.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

/**
 * Handle MongoDB duplicate key errors
 */
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
  return new AppError(message, 409, 'DUPLICATE_ERROR');
};

/**
 * Handle MongoDB cast errors
 */
const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400, 'CAST_ERROR');
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401, 'JWT_ERROR');
};

/**
 * Handle JWT expired errors
 */
const handleJWTExpiredError = () => {
  return new AppError('Token expired. Please log in again.', 401, 'JWT_EXPIRED');
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err.message,
    code: err.code,
    stack: err.stack,
    details: err
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      error: 'Something went wrong!',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.code = err.code || 'INTERNAL_ERROR';
  
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      error = handleValidationError(error);
    }
    
    if (error.code === 11000) {
      error = handleDuplicateKeyError(error);
    }
    
    if (error.name === 'CastError') {
      error = handleCastError(error);
    }
    
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    
    sendErrorProd(error, res);
  }
};

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Promise Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  process.exit(1);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = {
  AppError,
  errorHandler
};
