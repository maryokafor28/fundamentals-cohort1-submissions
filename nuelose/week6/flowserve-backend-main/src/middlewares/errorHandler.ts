import type{ Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export class ApiError extends Error {
  statusCode: number;
  details?: any;
  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}


export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.statusCode || 500;

  if (status >= 500) {
    logger.error("Unhandled Server Error", {
      message: err.message,
      stack: err.stack,
      details: err.details ?? null,
    });
  }

  return res.status(status).json({
    success: false,
    error: err.message,
    details: Array.isArray(err.details) ? err.details : err.details ?? null,
  });
}
