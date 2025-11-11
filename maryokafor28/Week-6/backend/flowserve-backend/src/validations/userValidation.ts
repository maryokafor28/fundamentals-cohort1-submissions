import { z } from "zod";

// For creating a user (validates body)
export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email format",
    }),
  }),
});

// For getting users with pagination (validates query params)
export const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .int("Page must be an integer")
      .positive("Page must be greater than 0")
      .default(1),
    limit: z.coerce
      .number()
      .int("Limit must be an integer")
      .positive("Limit must be greater than 0")
      .max(100, "Limit must be 100 or less")
      .default(10),
  }),
});
// ✅ Get a single user by ID
export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format"),
  }),
});
// ✅ Update user
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format"),
  }),
  body: z
    .object({
      name: z.string().min(2).optional(),
      email: z.string().email("Invalid email format").optional(),
    })
    .refine(
      (data) => data.name || data.email,
      "At least one field (name or email) must be provided"
    ),
});

// ✅ Delete user
export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format"),
  }),
});
