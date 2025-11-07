import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).send({ error: message, details: err.details || null });
}
