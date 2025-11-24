const { z } = require('zod');

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    walletBalance: z.number().nonnegative('Wallet balance cannot be negative').optional()
  })
});

const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID')
  }),
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').optional(),
    walletBalance: z.number().nonnegative('Wallet balance cannot be negative').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional()
  })
});

const getUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID')
  })
});

const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID')
  })
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema
};