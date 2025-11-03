import { verifyAccessToken } from "../utils/jwt";
import { User } from "../models/User";
import type { Request, Response, NextFunction } from "express";

export const requireAuth = async (req: Request, res: Response, next:NextFunction) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: "No token" });

  const token = header.split(" ")[1] || "";

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.id);
    if (!user) return res.status(400).json({ message: "User not found" });
    req.user = user;
    next();
  } catch {
    res.status(400).json({ message: "Invalid token" });
  }
};

export const requireRole = (role: string) => (req: Request, res:Response, next:NextFunction) => {
    if (req.user.role !== role) 
        return res.status(400).json({message: "Access denied"});
    
    
    next()
}