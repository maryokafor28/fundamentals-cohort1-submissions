import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
