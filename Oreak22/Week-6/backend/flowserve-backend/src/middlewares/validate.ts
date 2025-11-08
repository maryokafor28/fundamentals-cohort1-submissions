import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).send({ error: 'Validation error', details: err.errors ?? err.message });
  }
};

export const validateQuery = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (err: any) {
    return res.status(400).send({ error: 'Validation error', details: err.errors ?? err.message });
  }
};
