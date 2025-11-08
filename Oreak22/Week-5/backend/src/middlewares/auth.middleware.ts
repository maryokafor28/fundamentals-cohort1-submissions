import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Doctor } from "../models/doctor.model";
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
    const doctor = await Doctor.findById(decoded._id);
    if (!doctor) return res.status(403).send({ message: "user not found" });
    if (!doctor.accessToken)
      return res.status(403).send({ message: "Invalid" });
    const confirmToken = await bcrypt.compare(token, doctor?.accessToken);
    if (!confirmToken)
      return res.status(401).send({ message: "Expired or invalid token " });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
