// src/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { errorLoggerInstance } from "../utils/loggers";

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  // Log error details
  errorLoggerInstance.error("APP_ERROR", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode,
    ip: req.ip,
  });

  // Return JSON response
  res.status(statusCode).json({
    status,
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
