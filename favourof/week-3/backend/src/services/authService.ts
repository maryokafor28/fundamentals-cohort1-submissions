import jwt from "jsonwebtoken";
import { IUser } from "../models/user";
import dotenv from "dotenv";
import { errorLoggerInstance } from "../utils/logger";

dotenv.config();

const ACCESS_TOKEN_SECRET: jwt.Secret = process.env
  .ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET: jwt.Secret = process.env
  .REFRESH_TOKEN_SECRET as string;
// const ACCESS_TOKEN_EXPIRES: string | number = process.env.ACCESS_TOKEN_EXPIRES || "15m";
// const REFRESH_TOKEN_EXPIRES: string | number = process.env.REFRESH_TOKEN_EXPIRES || "7d";

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET");
}

export const generateAccessToken = (user: IUser): string => {
  const payload = { id: user._id, role: user.role };
  const options: jwt.SignOptions = { expiresIn: "15m" };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};

export const generateRefreshToken = (user: IUser): string => {
  const payload = { id: user._id };
  const options: jwt.SignOptions = { expiresIn: "7d" };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};
