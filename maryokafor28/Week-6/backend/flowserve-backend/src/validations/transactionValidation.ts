import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    description: z.string().optional(),
    senderId: z.uuid({ message: "Sender ID must be a valid UUID" }),
    receiverId: z.uuid({ message: "Receiver ID must be a valid UUID" }),
  }),
});

export const getTransactionsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED"]).optional(),
    userId: z.string().uuid().optional(), // ✅ Add this
  }),
});

export const updateTransactionStatusSchema = z.object({
  params: z.object({
    id: z.uuid({ message: "Invalid transaction ID" }),
  }),
  body: z.object({
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED"], {
      message: "Invalid status value",
    }),
  }),
});
