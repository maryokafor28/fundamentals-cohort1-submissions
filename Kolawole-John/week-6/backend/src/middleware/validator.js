const { AppError } = require('./errorHandler');

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1) {
    return next(new AppError('Page must be greater than 0', 400, 'INVALID_PAGE'));
  }

  if (limit < 1 || limit > 100) {
    return next(new AppError('Limit must be between 1 and 100', 400, 'INVALID_LIMIT'));
  }

  req.query.page = page;
  req.query.limit = limit;
  next();
};

module.exports = { validate, validatePagination };