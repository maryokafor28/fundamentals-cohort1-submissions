import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { securityLoggerInstance } from "../utils/logger";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/authService";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      securityLoggerInstance.warn("REGISTER_FAILED_EXISTING_USER", {
        email,
        ip: req.ip,
      });
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await User.create({ name, email, password });
    const accessToken = generateAccessToken(newUser);

    securityLoggerInstance.info("REGISTER_FAILED_EXISTING_USER", {
      email,
      ip: req.ip,
    });

    res.status(200).json({
      message: "Registration successful",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      accessToken,
    });
  } catch (err) {
    securityLoggerInstance.error("REGISTER_ERROR", {
      error: (err as Error).message,
      ip: req.ip,
    });
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select(
      "+password +refreshToken"
    );

    if (!user) {
      securityLoggerInstance.warn("LOGIN_FAIL_INVALID_CRED", {
        email,
        ip: req.ip,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🧩 Step 1: Check if user is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const unlockTime = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000
      );
      securityLoggerInstance.warn("LOGIN_FAIL_ACCOUNT_LOCKED", {
        email,
        unlockTime,
        ip: req.ip,
      });
      return res.status(403).json({
        message: `Account locked. Try again in ${unlockTime} minutes.`,
      });
    }

    // 🧩 Step 2: Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      // Lock if 3rd failed attempt
      if (user.failedLoginAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // lock 30 min
        user.failedLoginAttempts = 0; // reset count after locking
        await user.save();

        securityLoggerInstance.error("ACCOUNT_LOCKED", { email, ip: req.ip });
        return res.status(403).json({
          message:
            "Account locked for 30 minutes due to multiple failed attempts.",
        });
      }

      await user.save();
      securityLoggerInstance.warn("LOGIN_FAIL_INVALID_CRED", {
        email,
        attempts: user.failedLoginAttempts,
        ip: req.ip,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🧩 Step 3: Reset lock + failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    // 🧩 Step 4: Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // 🧩 Step 5: Set cookie and respond
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    securityLoggerInstance.info("LOGIN_SUCCESS", {
      userId: user._id,
      email,
      ip: req.ip,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    securityLoggerInstance.error("LOGIN_ERROR", {
      error: (err as Error).message,
      ip: req.ip,
    });
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      securityLoggerInstance.warn("TOKEN_REFRESH_FAIL_NO_COOKIE", {
        ip: req.ip,
      });
      return res.status(401).json({ message: "No refresh token found" });
    }

    const refreshToken = cookies.jwt;

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      securityLoggerInstance.error("TOKEN_REUSE_DETECTED", {
        ip: req.ip,
        token: refreshToken,
      });
      return res.status(403).json({ message: "Token reuse detected" });
    }

    // Verify token validity
    jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      async (err: any, decoded: any) => {
        if (err || user._id?.toString() !== decoded.id) {
          securityLoggerInstance.warn("TOKEN_REFRESH_FAIL_INVALID", {
            userId: user._id,
            ip: req.ip,
          });
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Rotate: save new refresh token, delete old
        user.refreshToken = newRefreshToken;
        await user.save();

        // Send new refresh token as cookie
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        securityLoggerInstance.info("TOKEN_REFRESH_SUCCESS", {
          userId: user._id,
          ip: req.ip,
        });

        return res.json({ accessToken: newAccessToken });
      }
    );
  } catch (err) {
    securityLoggerInstance.error("TOKEN_REFRESH_ERROR", {
      error: (err as Error).message,
      ip: req.ip,
    });
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      securityLoggerInstance.warn("LOGOUT_FAIL_NO_TOKEN", { ip: req.ip });
      return res.status(204).json({ message: "No active session" });
    }

    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });

    // No matching user — possible reuse or already logged out
    if (!user) {
      securityLoggerInstance.warn("LOGOUT_FAIL_UNKNOWN_TOKEN", { ip: req.ip });
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(204).json({ message: "Session cleared" });
    }

    // Clear refresh token in DB
    user.refreshToken = null;
    await user.save();

    // Clear cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    securityLoggerInstance.info("LOGOUT_SUCCESS", {
      userId: user._id,
      email: user.email,
      ip: req.ip,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    securityLoggerInstance.error("LOGOUT_ERROR", {
      error: (err as Error).message,
      ip: req.ip,
    });
    next(err);
  }
};
