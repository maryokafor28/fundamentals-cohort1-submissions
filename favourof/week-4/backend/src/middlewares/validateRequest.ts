import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((d: any) => d.message).join(", ");
      return next(new AppError(message, 400));
    }

    next();
  };
};

export default validateRequest;
