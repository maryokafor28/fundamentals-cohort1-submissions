import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorizeAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.user;
  if (role != "admin")
    return res.status(401).send({ message: "Unauthorized request" });
  next();
};
