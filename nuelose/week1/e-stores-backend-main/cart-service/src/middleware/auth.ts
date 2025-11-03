import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log({ token });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log({ decoded });
    (req as any).user = decoded;
    let userData = await User.findOne({ _id: decoded.userId });
    console.log({ userData });
    req.user = userData;
    next();
  } catch (e) {
    return res.status(401).json({ message: "NO token provided" });
  }
};
