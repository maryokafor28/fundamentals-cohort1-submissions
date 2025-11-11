// src/controllers/AuthController.ts
import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authservices";
import jwt from "jsonwebtoken";
import type { UserDocument } from "../models/userschema";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, name and password are required" });
      return;
    }

    const user = await registerUser({ email, password, name });
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    res.status(201).json({ message: "User registered", user: userResponse });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        error: "Identifier (email or name) and password are required",
      });
      return;
    }

    // Get user from service
    const user: UserDocument = await loginUser({ identifier, password });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    console.log("Generated token:", typeof token, token); // Debug log

    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    res.status(200).json({
      message: "Logged in",
      token, // ✅ JWT string
      user: userResponse, // ✅ User object (you were missing this!)
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Invalid credentials" });
  }
};
