import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";

/**
 * Middleware to check if user has required role(s)
 * Usage: authorize("user"), authorize("doctor"), authorize("user", "doctor")
 */
export const authorize = (...roles: Array<"user" | "doctor">) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires ${roles.join(
          " or "
        )} role. You are: ${req.user.role}`,
      });
    }

    next();
  };
};
