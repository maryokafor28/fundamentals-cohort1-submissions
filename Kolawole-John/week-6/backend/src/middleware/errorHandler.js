const logger = require('../config/logger');
const { Prisma } = require('@prisma/client');

class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.code = err.code || 'INTERNAL_ERROR';

  // Log error
  logger.error({
    message: error.message,
    code: error.code,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    error.message = 'Invalid data provided';
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
  }

  // Prisma known request error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      error.message = 'Duplicate entry found';
      error.statusCode = 409;
      error.code = 'DUPLICATE_ERROR';
    } else if (err.code === 'P2025') {
      error.message = 'Record not found';
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
    } else {
      error.message = 'Database operation failed';
      error.statusCode = 400;
      error.code = 'DATABASE_ERROR';
    }
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    error.message = 'Validation failed';
    error.statusCode = 422;
    error.code = 'VALIDATION_ERROR';
    error.details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
  }

  // Send response
  const response = {
    success: false,
    message: error.message,
    error: {
      code: error.code,
      ...(error.details && { details: error.details })
    }
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = { errorHandler, AppError };