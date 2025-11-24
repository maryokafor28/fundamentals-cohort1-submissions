const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { validate, validatePagination } = require('../middleware/validator');
const { createTransactionLimiter } = require('../middleware/rateLimiter');
const {
  createTransactionSchema,
  getTransactionSchema,
  getUserTransactionsSchema
} = require('../validations/transactionValidation');

/**
 * @route   GET /api/v1/transactions
 * @desc    Get all transactions (paginated)
 * @access  Public
 */
router.get('/', validatePagination, transactionController.getAllTransactions);

/**
 * @route   GET /api/v1/transactions/:id
 * @desc    Get transaction by ID
 * @access  Public
 */
router.get(
  '/:id',
  validate(getTransactionSchema),
  transactionController.getTransactionById
);

/**
 * @route   GET /api/v1/transactions/user/:userId
 * @desc    Get all transactions for a user
 * @access  Public
 */
router.get(
  '/user/:userId',
  validatePagination,
  validate(getUserTransactionsSchema),
  transactionController.getUserTransactions
);

/**
 * @route   POST /api/v1/transactions
 * @desc    Create new transaction
 * @access  Public
 */
router.post(
  '/',
  createTransactionLimiter,
  validate(createTransactionSchema),
  transactionController.createTransaction
);

module.exports = router;