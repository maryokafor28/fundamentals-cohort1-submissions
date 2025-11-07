import { Request, Response, NextFunction } from "express";
import { requestLoggerInstance } from "../utils/loggers";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  res.on("finsish", () => {
    const duration = Date.now() - start;
    requestLoggerInstance.info("HTTP_REQUEST", {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      duration: `${duration}ms`,
      statusCode: res.statusCode,
    });
  });

  next();
};
