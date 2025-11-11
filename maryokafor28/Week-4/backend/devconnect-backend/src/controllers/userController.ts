// src/controllers/userController.ts
import { Request, Response } from "express";
import User from "../models/users";

interface AuthRequest extends Request {
  user?: any;
}

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = [
      "name",
      "email",
      "bio",
      "techStack",
      "github",
      "linkedin",
    ];
    const updates: Record<string, any> = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Failed to update profile" });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    console.log(" Fetching user by ID:", req.params.id);

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      console.log(" User not found for ID:", req.params.id);

      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error(" getUserById error:", error);
    if (error && error.message) {
      console.error(" getUserById error:", error.message);
    }

    res.status(500).json({ message: "Failed to fetch user" });
  }
};
