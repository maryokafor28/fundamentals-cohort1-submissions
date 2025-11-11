import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import * as authService from "../services/authServices";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "../services/tokenServices";
import { env } from "../config/env";
import User from "../models/users";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validation";

function handleError(res: Response, status: number, message: string): void {
  res.status(status).json({ success: false, message });
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    // Quick check before DB validation
    if (!name || !email || !password) {
      handleError(res, 400, "All fields are required");
      return;
    }
    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      handleError(res, 400, nameValidation.message!);
      return;
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      handleError(res, 400, emailValidation.message!);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      handleError(res, 400, passwordValidation.message!);
      return;
    }

    const user = await authService.registerUser(name, email, password);

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error("Registration error:", error.message);

    // Handle duplicate email error
    if (error.code === 11000) {
      handleError(res, 400, "Email already exists");
      return;
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((val: any) => val.message)
        .join(", ");
      handleError(res, 400, messages);
      return;
    }

    handleError(res, 500, "Registration failed");
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      handleError(res, 400, "Email and password are required");
      return;
    }
    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      handleError(res, 400, emailValidation.message!);
      return;
    }

    const user = await authService.loginUser(email, password);
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    handleError(res, 401, error.message || "Invalid credentials");
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  clearAuthCookies(res);
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    handleError(res, 401, "No refresh token provided");
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("_id name email");

    if (!user) {
      handleError(res, 401, "Invalid refresh token");
      return;
    }

    // ✅ Generate both tokens and use helper function for consistent cookie settings
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
      user,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    handleError(res, 403, "Invalid or expired refresh token");
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    // req.user.id should be set by your authenticateToken middleware
    const user = req.user;

    if (!user) {
      handleError(res, 404, "User not found");
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Get me error:", error.message);
    handleError(res, 500, "Failed to get user information");
  }
}
