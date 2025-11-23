const TransactionService = require('../services/transaction.service');

exports.createTransaction = async (req, res, next) => {
  try {
    const result = await TransactionService.createTransaction(
      req.user.id,
      req.validatedData
    );

    res.status(201).json({
      status: 'success',
      data: {
        transaction: result
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      status: req.query.status
    };

    const pagination = {
      page: req.query.page,
      limit: req.query.limit
    };

    const result = await TransactionService.getUserTransactions(
      req.user.id,
      filters,
      pagination
    );

    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await TransactionService.getTransactionById(
      req.params.id,
      req.user.id
    );

    res.json({
      status: 'success',
      data: {
        transaction
      }
    });
  } catch (error) {
    next(error);
  }
};