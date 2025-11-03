import { z } from "zod";

export const transactionSchema = z.object({
  body: z.object({
    type: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"], {
      message: "Transaction type is required",
    }),
    amount: z.coerce.number().positive("Amount must be greater than zero"),
    description: z.string().optional(),
    userEmail: z.string().email("Invalid user ID format"),
    senderEmail: z.string().email().optional(),
    receiverEmail: z.string().email().optional(),
  }).refine((data) => {
  if (data.type === "TRANSFER" && (!data.senderEmail || !data.receiverEmail)) {
    return false;
  }
  return true;
}, {
  message: "Transfer must include both senderId and receiverId",
})
})

export const transactionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid transaction ID"),
  }),
});

export type TransactionInput = z.infer<typeof transactionSchema>["body"];
