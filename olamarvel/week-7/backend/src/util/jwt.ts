import jwt from "jsonwebtoken";
import { IUser } from "../Models/User";

const ACCESS_SECRET = (process.env.ACCESS_TOKEN_SECRET) as jwt.Secret;
const REFRESH_SECRET = (process.env.REFRESH_TOKEN_SECRET) as jwt.Secret;

const ACCESS_EXPIRES: jwt.SignOptions["expiresIn"] = (process.env.ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"]) || "15m";
const REFRESH_EXPIRES: jwt.SignOptions["expiresIn"] = (process.env.REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"]) || "7d";


export function signAccess(user: IUser) {
  return jwt.sign({ sub: String(user._id) }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefresh(userId: string | any, jti: string) {
  return jwt.sign({ sub: String(userId), jti }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyRefresh(token: string) {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { sub: string; jti: string; iat?: number; exp?: number };
  } catch {
    return null;
  }
}

export function verifyAccess(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET) as { sub: string; iat?: number; exp?: number };
  } catch {
    return null;
  }
}