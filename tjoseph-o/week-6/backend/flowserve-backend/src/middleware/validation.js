const Joi = require('joi');
const { AppError } = require('./error');

const validate = (schema) => (req, res, next) => {
  const validationResult = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (validationResult.error) {
    const errorMessage = validationResult.error.details
      .map(detail => detail.message)
      .join(', ');
    
    return next(new AppError(400, errorMessage));
  }

  req.validatedData = validationResult.value;
  return next();
};

// Common validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
  validate,
  paginationSchema
};