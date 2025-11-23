const { Transaction, User } = require('../models');
const { AppError } = require('../middleware/error');
const { sequelize } = require('../config/db');
const { randomUUID } = require('crypto');

class TransactionService {
  static async createTransaction(userId, transactionData) {
    const t = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId, { transaction: t });
      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const { type, amount, recipientId, description } = transactionData;
      
      
      if (['withdrawal', 'transfer'].includes(type) && parseFloat(user.balance) < amount) {
        throw new AppError(400, 'Insufficient funds');
      }

     
      switch (type) {
        case 'deposit':
          await user.increment('balance', { by: amount, transaction: t });
          break;

        case 'withdrawal':
          await user.decrement('balance', { by: amount, transaction: t });
          break;

        case 'transfer':
          const recipient = await User.findByPk(recipientId, { transaction: t });
          if (!recipient) {
            throw new AppError(404, 'Recipient not found');
          }
          
          await user.decrement('balance', { by: amount, transaction: t });
          await recipient.increment('balance', { by: amount, transaction: t });
          break;
      }

      // Create transaction record
      const transaction = await Transaction.create({
        id: randomUUID(),
        userId,
        type,
        amount,
        recipientId: type === 'transfer' ? recipientId : null,
        status: 'completed',
        description,
        reference: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }, { transaction: t });

      await t.commit();
      return transaction;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getUserTransactions(userId, filters = {}, pagination = {}) {
    const { type, status } = filters;
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const whereClause = {
      userId,
      ...(type && { type }),
      ...(status && { status })
    };

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'email', 'firstName', 'lastName'],
          required: false
        }
      ]
    });

    return {
      transactions,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
  }

  static async getTransactionById(transactionId, userId) {
    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        userId
      },
      include: [
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'email', 'firstName', 'lastName'],
          required: false
        }
      ]
    });

    if (!transaction) {
      throw new AppError(404, 'Transaction not found');
    }

    return transaction;
  }
}

module.exports = TransactionService;