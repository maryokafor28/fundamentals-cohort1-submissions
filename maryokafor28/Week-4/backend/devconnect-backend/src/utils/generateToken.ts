// src/utils/generateToken.ts
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const generateToken = (userId: string): string => {
  if (!env.ACCESS_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in environment variables"
    );
  }

  return jwt.sign({ id: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d", // token expires in 7 days
  });
};

export default generateToken;
