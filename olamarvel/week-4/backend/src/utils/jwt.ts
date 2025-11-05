
import jwt from "jsonwebtoken";

const ACCESS_SECRET = (process.env.ACCESS_TOKEN_SECRET || "access-secret") as jwt.Secret;
const REFRESH_SECRET = (process.env.REFRESH_TOKEN_SECRET || "refresh-secret") as jwt.Secret;

const ACCESS_EXPIRES: jwt.SignOptions["expiresIn"] = (process.env.ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"]) || "15m";
const REFRESH_EXPIRES: jwt.SignOptions["expiresIn"] = (process.env.REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"]) || "7d";

export function signAccess(user: { _id: any; role: string }) {
  return jwt.sign({ sub: String(user._id), role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
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
