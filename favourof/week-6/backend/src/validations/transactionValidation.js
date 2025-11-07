import Joi from "joi";

export const createTransactionSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number",
    "any.required": "User ID is required",
  }),

  type: Joi.string().valid("credit", "debit").required().messages({
    "any.only": "Type must be either 'credit' or 'debit'",
    "any.required": "Transaction type is required",
  }),

  amount: Joi.number().min(100).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Minimum transaction amount is ₦100",
    "any.required": "Amount is required",
  }),

  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be text",
  }),
});
