const { body, param } = require('express-validator');

const validateAddToCart = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('User ID must be between 1 and 50 characters'),
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Product ID must be a valid MongoDB ObjectId'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be a number between 1 and 50')
];

const validateUpdateCartItem = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('User ID must be between 1 and 50 characters'),
  body('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isMongoId()
    .withMessage('Item ID must be a valid MongoDB ObjectId'),
  body('quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be a number between 1 and 50')
];

const validateRemoveFromCart = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('User ID must be between 1 and 50 characters'),
  body('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isMongoId()
    .withMessage('Item ID must be a valid MongoDB ObjectId')
];

const validateUserId = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('User ID must be between 1 and 50 characters')
];

module.exports = {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveFromCart,
  validateUserId
};
