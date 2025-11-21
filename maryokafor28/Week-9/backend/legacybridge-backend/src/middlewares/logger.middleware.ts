import { Request, Response, NextFunction } from "express";
import { env, isDevelopment } from "../config/env.config";

/**
 * Determine if we should log based on status code and log level
 */
const shouldLog = (statusCode: number, logLevel: string): boolean => {
  switch (logLevel) {
    case "error":
      return statusCode >= 500;
    case "warn":
      return statusCode >= 400;
    case "info":
      return statusCode >= 200;
    case "debug":
      return true;
    default:
      return true;
  }
};

/**
 * Logger middleware - logs HTTP requests with timing
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Check if we should log based on log level
    if (!shouldLog(res.statusCode, env.LOG_LEVEL)) {
      return;
    }

    if (isDevelopment) {
      // Human-readable logs for development
      console.log(
        `[${timestamp}] ${req.method.padEnd(6)} ${req.originalUrl.padEnd(30)} ${
          res.statusCode
        } ${duration}ms`
      );

      // Debug level: show request details
      if (env.LOG_LEVEL === "debug") {
        if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
          console.log(`  ↳ Body:`, req.body);
        }
        if (Object.keys(req.query).length > 0) {
          console.log(`  ↳ Query:`, req.query);
        }
      }
    } else {
      // Production: JSON structured logging
      const logData: Record<string, unknown> = {
        timestamp,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get("user-agent"),
      };

      // Add body for errors
      if (res.statusCode >= 400 && req.body) {
        logData.body = req.body;
      }

      console.log(JSON.stringify(logData));
    }
  });

  next();
};
