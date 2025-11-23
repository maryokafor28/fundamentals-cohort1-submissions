const auth = require('./auth');
const optionalAuth = require('./optionalAuth');
const { validate, schemas } = require('./validation');
const { errorHandler, notFound, asyncHandler } = require('./errorHandler');

module.exports = {
  auth,
  optionalAuth,
  validate,
  schemas,
  errorHandler,
  notFound,
  asyncHandler
};