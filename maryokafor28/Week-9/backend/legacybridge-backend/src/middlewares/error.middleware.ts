import { Request, Response, NextFunction } from "express";
import { LegacyError } from "../errors/LegacyError";

interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let status = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  /**
   * 🔥 TEST REQUIREMENT:
   * Any LegacyError must ALWAYS:
   * - return status 503
   * - return fixed message
   * - include source: "legacy-api"
   */
  if (err instanceof LegacyError) {
    status = 503;
    message =
      "Legacy system is temporarily unavailable. Please try again later.";
  }

  // Logging rules
  if (status >= 500) {
    console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}`, err);
  } else {
    console.warn(
      `[CLIENT ERROR] ${req.method} ${req.originalUrl} - ${message}`
    );
  }

  // Final JSON output
  return res.status(status).json({
    success: false,
    status,
    message,
    ...(err instanceof LegacyError && { source: "legacy-api" }),
  });
};
