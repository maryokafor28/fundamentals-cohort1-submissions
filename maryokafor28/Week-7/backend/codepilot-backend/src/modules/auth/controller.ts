// src/modules/auth/controller.ts
import { Request, Response } from "express";
import * as authService from "./service";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await authService.registerUser({ name, email, password });
    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (err: any) {
    // Check for duplicate from service
    if (err.message === "User already exists") {
      return res.status(409).json({ message: "Email already exists" });
    }

    // handle duplicate key error from mongoose
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res
      .status(400)
      .json({ message: err.message || "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const { token, user } = await authService.loginUser({ email, password });
    return res.json({ token, user });
  } catch (err: any) {
    return res
      .status(401)
      .json({ message: err.message || "Invalid credentials" });
  }
}
