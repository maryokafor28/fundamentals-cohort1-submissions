import { Request, Response, NextFunction } from "express";
import logger from "../loggers/logger";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error({
    message: "Unhandled Error",
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : null,
    method: req.method,
    url: req.url,
  });

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
}
