import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
import { User } from "../models/user.models";
import bcrypt from "bcryptjs";
dotenv.config();

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    const user = await User.findById(decoded._id);
    if (!user) return res.status(403).send({ message: "user not found" });
    if (!user.accessToken) return res.status(403).send({ message: "Invalid" });
    const confirmToken = await bcrypt.compare(token, user?.accessToken);
    if (!confirmToken)
      return res.status(401).send({ message: "Expired or invalid token " });
    req.user = decoded;
    next();
  } catch (err) {

    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
