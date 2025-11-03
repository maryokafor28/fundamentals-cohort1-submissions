import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export interface AuthRequest extends Request {
  user?: any;
}

const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        res.status(400).json({ message: "JWT_SECRET not found" });
        return;
      }

      const bearer = jwt.verify(token, secret) as { userId: string };
      const user = await User.findById(bearer.userId).select("-password");
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      req.user = user;
      next();
      return;
    } catch (err) {
      res.status(400).json({ message: "Not authorized, Token failed" });
      return;
    }
  }

  if (!token) {
    res.status(400).json({ message: "Not authorized, No Token" });
    return;
  }
};

export default requireAuth;
