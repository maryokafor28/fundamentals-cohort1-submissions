import { Request, Response, NextFunction } from "express";
import { securityLoggerInstance } from "../utils/logger";

export const requiredRole = (role: "admin" | "user") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== role) {
      securityLoggerInstance.warn("ACCESS_DENIED_ROLE", {
        userId: req.user.id,
        role: req.user.role,
        requiredRole: role,
        route: req.originalUrl,
      });
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};
