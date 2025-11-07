//UNSUPPORTED ENDPOINTS
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.code = 404;
  next(error);
}

//ERROR MIDDLEWARE
const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  
  const statusCode = error.code || error.statusCode || 500;
  const message = error.message || "An unknown error occurred.";
  
  res.status(statusCode).json({ 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
}

module.exports = {notFound, errorHandler}
