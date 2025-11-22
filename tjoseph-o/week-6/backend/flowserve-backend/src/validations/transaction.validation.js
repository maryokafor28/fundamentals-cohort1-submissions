const Joi = require('joi');

const createTransactionSchema = Joi.object({
  type: Joi.string().valid('deposit', 'withdrawal', 'transfer').required(),
  amount: Joi.number().positive().precision(2).required(),
  recipientId: Joi.string().uuid()
    .when('type', {
      is: 'transfer',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
  description: Joi.string().max(255)
});

const updateTransactionSchema = Joi.object({
  status: Joi.string().valid('completed', 'failed', 'reversed').required()
});

module.exports = {
  createTransactionSchema,
  updateTransactionSchema
};