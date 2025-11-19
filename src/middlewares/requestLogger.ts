import { Request, Response, NextFunction } from "express";
import logger from "../loggers/logger";

export default function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info({
    message: "Incoming Request",
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  next();
}
