import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { securityLoggerInstance } from "../utils/loggers";
import { config } from "../config/config";
const ACCESS_TOKEN_SECRET = config.accessToken;

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
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as any;
    req.user = decoded;

    next();
  } catch (err) {
    securityLoggerInstance.warn("ACCESS_DENIED_INVALID_TOKEN", { ip: req.ip });
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
