import { z } from 'zod';

export const simulateTransactionSchema = z.object({
  fromUserId: z.string().uuid().optional(),
  toUserId: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.string().min(3).max(5),
  type: z.enum(['deposit', 'withdrawal', 'transfer']),
});
