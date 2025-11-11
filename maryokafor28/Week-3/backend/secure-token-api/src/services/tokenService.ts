import jwt from "jsonwebtoken";
import { Response } from "express";
import { env } from "../config/env";
import { TokenBlacklist } from "../models/tokenBlacklist";

const JWT_SECRET = env.accessTokenSecret;
const JWT_REFRESH_SECRET = env.refreshTokenSecret;

export function generateAccessToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as {
    userId: string;
    role: string;
  };
}

export async function blacklistToken(token: string) {
  await TokenBlacklist.create({ token });
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const found = await TokenBlacklist.findOne({ token });
  return !!found;
}

// ✅ NEW: Helper to set auth cookies (DRY principle)
export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  const isProduction = process.env.NODE_ENV === "production";

  // Set access token cookie (15 minutes)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set refresh token cookie (7 days)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// ✅ NEW: Helper to clear auth cookies
export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}
