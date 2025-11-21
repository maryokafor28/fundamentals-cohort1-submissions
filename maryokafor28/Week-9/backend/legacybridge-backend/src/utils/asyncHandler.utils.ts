import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to the global error middleware.
 *
 * @param fn - Async route handler function
 * @returns Express RequestHandler
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
