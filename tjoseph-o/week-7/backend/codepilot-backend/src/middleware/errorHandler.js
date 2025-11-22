const logger = require('../utils/logger');
const { sendError } = require('../utils/response');


const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });


  if (err.isOperational) {
    return sendError(res, err.statusCode, err.message);
  }


  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }


  if (err.name === 'ValidationError') {
    return sendError(res, 400, err.message);
  }

 
  return sendError(
    res,
    500,
    'Internal server error',
    process.env.NODE_ENV === 'development' ? err.message : null
  );
};


const notFoundHandler = (req, res) => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  notFoundHandler
};