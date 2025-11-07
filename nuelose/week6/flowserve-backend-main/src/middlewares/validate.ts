import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";
import { ApiError } from "./errorHandler";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (result.body) req.body = result.body as typeof req.body;
      if (result.query) req.query = result.query as any;
      if (result.params) req.params = result.params as any;
      next();
    } catch (e: any) {
      if (e instanceof ZodError) {
        const formattedIssues = e.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return next(new ApiError("Validation failed", 400, formattedIssues));
      }

      next(new ApiError("Validation failed", 400, e));
    }
  };
