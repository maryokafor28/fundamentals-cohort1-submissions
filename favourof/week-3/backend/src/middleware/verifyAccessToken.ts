import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { securityLoggerInstance } from "../utils/logger";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    securityLoggerInstance.warn("ACCESS_DENIED_NO_TOKEN", { ip: req.ip });
    return res.status(401).json({ massage: "No token Provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    securityLoggerInstance.warn("ACCESS_DENIED_INVALID_TOKEN", { ip: req.ip });
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
