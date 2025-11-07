import { Request, Response, NextFunction } from "express";
import { errorLoggerInstance } from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorLoggerInstance.error("SERVER_ERROR", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    route: req.originalUrl,
    method: req.method,
  });

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};
