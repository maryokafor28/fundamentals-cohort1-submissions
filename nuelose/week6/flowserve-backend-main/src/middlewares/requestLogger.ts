import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`, {
    body: req.body,
    params: req.params,
    query: req.query,
  });
  next();
};
