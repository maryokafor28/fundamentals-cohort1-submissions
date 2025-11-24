const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate, validatePagination } = require('../middleware/validator');
const { strictRateLimiter } = require('../middleware/rateLimiter');
const {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema
} = require('../validations/userValidation');

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (paginated)
 * @access  Public
 */
router.get('/', validatePagination, userController.getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', validate(getUserSchema), userController.getUserById);

/**
 * @route   POST /api/v1/users
 * @desc    Create new user
 * @access  Public
 */
router.post(
  '/',
  strictRateLimiter,
  validate(createUserSchema),
  userController.createUser
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Public
 */
router.put(
  '/:id',
  validate(updateUserSchema),
  userController.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Public
 */
router.delete(
  '/:id',
  validate(deleteUserSchema),
  userController.deleteUser
);

module.exports = router;