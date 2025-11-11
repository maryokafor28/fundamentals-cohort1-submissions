import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { env } from "../config/env";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies, // ✅ Import new helper
} from "../services/tokenService";
import {
  isValidEmail,
  isValidPassword,
  isValidRole,
  sanitizeObjectInput,
} from "../utils/validators";

const LOCK_DURATION_MINUTES = Number(env.lockDurationMinutes || 30);
const MAX_LOGIN_ATTEMPTS = Number(env.maxLoginAttempts || 3);

// =====================
// REGISTER USER
// =====================
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 🧼 Sanitize everything in req.body
    const cleanBody = sanitizeObjectInput(req.body);
    const { email, password, role } = cleanBody;

    // 🧩 Validation
    if (!isValidEmail(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (!isValidPassword(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, and number.",
      });
      return;
    }

    if (role && !isValidRole(role)) {
      res.status(400).json({ message: "Invalid user role" });
      return;
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      email,
      passwordHash,
      role: role || "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// =====================
// LOGIN USER (with lockout system + HttpOnly cookies)
// =====================
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const cleanBody = sanitizeObjectInput(req.body);
    const { email, password } = cleanBody;
    const LOCK_DURATION = LOCK_DURATION_MINUTES * 60 * 1000; // convert to ms

    if (!isValidEmail(email) || typeof password !== "string") {
      res.status(400).json({ message: "Invalid login credentials format" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const unlockTime = new Date(user.lockUntil).toLocaleTimeString();
      res.status(403).json({
        message: `Account locked. Try again after ${unlockTime}.`,
      });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION);
        await user.save();
        res.status(403).json({
          message: `Too many failed attempts. Account locked for ${LOCK_DURATION_MINUTES} minutes.`,
        });
        return;
      }

      await user.save();
      res.status(400).json({
        message: `Invalid email or password. You have ${
          MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts
        } attempts left.`,
      });
      return;
    }

    // Reset attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    // ✅ Set HttpOnly cookies (instead of sending in response body)
    setAuthCookies(res, accessToken, refreshToken);

    // ✅ Don't send tokens in response body
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
