const transactionService = require('../services/transactionService');
const { successResponse } = require('../utils/response');

const TransactionController = {
  getAllTransactions: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await transactionService.getAll(page, limit);
      
      res.status(200).json(successResponse(
        'Transactions retrieved successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  },

  getTransactionById: async (req, res, next) => {
    try {
      const result = await transactionService.getById(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }
      res.status(200).json(successResponse(
        'Transaction retrieved successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  },

  getUserTransactions: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await transactionService.getUserTransactions(
        req.params.userId,
        page,
        limit
      );
      
      res.status(200).json(successResponse(
        'User transactions retrieved successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  },

  createTransaction: async (req, res, next) => {
    try {
      const result = await transactionService.create(req.body);      
      res.status(201).json(successResponse(
        'Transaction created successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = TransactionController;