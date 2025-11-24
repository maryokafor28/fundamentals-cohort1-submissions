const { z } = require('zod');

const createTransactionSchema = z.object({
  body: z.object({
    userId: z.number().positive('User ID must be a positive number'),
    amount: z.number().positive('Amount must be greater than zero'),
    type: z.enum(['CREDIT', 'DEBIT'], { errorMap: () => ({ message: 'Type must be CREDIT or DEBIT' }) }),
    description: z.string().max(500, 'Description too long').optional()
  })
});

const getTransactionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid transaction ID')
  })
});

const getUserTransactionsSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, 'Invalid user ID')
  })
});

module.exports = {
  createTransactionSchema,
  getTransactionSchema,
  getUserTransactionsSchema
};