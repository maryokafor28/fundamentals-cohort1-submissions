import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/appError";
import { logger } from "../logger/pino";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error({ err }, "❌ Error occurred");

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "fail",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Record not found",
      });
    }

    // Unique constraint violation
    if (err.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "A record with this value already exists",
      });
    }

    // Foreign key constraint failed
    if (err.code === "P2003") {
      return res.status(400).json({
        status: "error",
        message: "Invalid reference to related record",
      });
    }
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data provided",
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
}
