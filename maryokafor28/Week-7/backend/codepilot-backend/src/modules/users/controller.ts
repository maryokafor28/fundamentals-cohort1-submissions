// src/modules/users/controller.ts
import { Request, Response } from "express";
import * as UserService from "./service";

// Define custom request interface
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // Add a check since user is optional
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User profile", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email } = req.body;

    const updatedUser = await UserService.updateUser(req.user.id, {
      name,
      email,
    });

    res.json({ message: "Profile updated", data: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
