import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}


export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = (req.headers["authorization"] || "") as string;
    if (!header.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) return res.status(500).json({ message: "Server config error" });

    const payload = jwt.verify(token, secret) as any;
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}

export const requireRole = (role: "admin" | "user") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
    if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
