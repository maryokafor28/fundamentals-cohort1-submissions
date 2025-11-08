// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
dotenv.config();

interface UserPayload {
  _id: string;
  email: string;
  name: string;
  role: string;
  userName: string;
}

export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (user: UserPayload): string => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
