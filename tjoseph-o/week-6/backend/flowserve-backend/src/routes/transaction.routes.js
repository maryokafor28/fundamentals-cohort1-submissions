const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  createTransactionSchema,
  updateTransactionSchema
} = require('../validations/transaction.validation');


router.use(protect);


router.post('/', validate(createTransactionSchema), transactionController.createTransaction);


router.get('/', transactionController.getTransactions);


router.get('/:id', transactionController.getTransaction);

module.exports = router;