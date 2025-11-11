// src/services/tokenService.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import { env } from "../config/env";

const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";

// Generate Access Token
export function generateAccessToken(userId: string) {
  return jwt.sign({ id: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
}

// Generate Refresh Token
export function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
}

// ✅ FIXED: Send cookies that work cross-origin (Render + Vercel)
export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  const isProduction = env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // must be true on HTTPS (Render)
    sameSite: isProduction ? "none" : "lax", // allow cross-origin cookies
  } as const;

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Verify token validity
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ✅ FIXED: Clear cookies with same options
export function clearAuthCookies(res: Response) {
  const isProduction = env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  } as const;

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
}
