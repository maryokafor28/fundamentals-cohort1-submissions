import { z } from 'zod';

// Schema for user registration
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'A valid email address is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(20, { message: 'Password must be no more than 20 characters long' }),
  }),
});

// Schema for user login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  }),
});

// Schema for sending funds
export const sendFundsSchema = z.object({
  body: z.object({
    recipientEmail: z.string().email({ message: 'Recipient email is required' }),
    amount: z.number().positive({ message: 'Amount must be a positive number' }),
  }),
});

// Schema for depositing funds
export const depositFundsSchema = z.object({
  body: z.object({
    amount: z.number().positive({ message: 'Amount must be a positive number' }),
  }),
});
