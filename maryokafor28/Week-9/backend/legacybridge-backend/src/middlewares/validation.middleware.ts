import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

/**
 * Format Zod errors into readable messages
 */
const formatZodErrors = (error: ZodError) => {
  return error.issues.map((err) => ({
    field: err.path.join(".") || "root",
    message: err.message,
    code: err.code,
  }));
};

/**
 * Middleware factory for validating request body, query, or params using Zod
 * @param schema - Zod schema to validate against
 * @param property - Which part of request to validate ("body" | "query" | "params")
 */
export const validationMiddleware =
  (schema: z.ZodTypeAny, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        status: 400,
        message: "Validation error",
        errors,
      });
      return;
    }

    // Replace with parsed/sanitized data
    (req[property] as any) = result.data;
    next();
  };
