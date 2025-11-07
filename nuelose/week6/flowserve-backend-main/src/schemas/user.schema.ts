import { z } from "zod";

export const userQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 10)),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be atleast 2 character long"),
    balance: z
      .number({ error: "balance must be a number" })
      .nonnegative("Balance must not be negative")
      .default(0),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format for user ID"),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid UUID format for user ID"),
  }),
  body: z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters").optional(),
      email: z.string().email("Invalid email format").optional(),
      balance: z.number({error: "balance must be a number"}).nonnegative("balance can't be negative")
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
