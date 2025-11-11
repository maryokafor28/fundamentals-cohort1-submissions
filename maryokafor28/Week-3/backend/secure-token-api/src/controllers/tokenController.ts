import { Request, Response } from "express";
import { User } from "../models/User";
import {
  generateAccessToken,
  verifyRefreshToken,
  blacklistToken,
  isTokenBlacklisted,
  setAuthCookies, // ✅ Import helpers
  clearAuthCookies,
} from "../services/tokenService";

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // ✅ Read refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token required" });
      return;
    }

    // Check blacklist
    const blacklisted = await isTokenBlacklisted(refreshToken);
    if (blacklisted) {
      res.status(403).json({ message: "Refresh token has been revoked" });
      return;
    }

    // Verify token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if token is still stored
    if (!user.refreshTokens.includes(refreshToken)) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.role);

    // ✅ Update only the access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(403).json({ message: "Refresh token expired" });
      return;
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // ✅ Read refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token required" });
      return;
    }

    // Verify token
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Remove token from user's list
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();

    // Blacklist it
    await blacklistToken(refreshToken);

    // ✅ Clear cookies using helper
    clearAuthCookies(res);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
