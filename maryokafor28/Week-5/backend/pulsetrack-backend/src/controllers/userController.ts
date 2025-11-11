// src/controllers/userController.ts
import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/userService";

// @desc Get user by ID
export const getMe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ✅ Get from URL params
    const userId = (req as any).user.id; // From auth middleware

    // ✅ User can only view their own profile
    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own profile",
      });
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    console.error("GetMe error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
};

// @desc Update user by ID
export const updateMe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ✅ Get from URL params
    const userId = (req as any).user.id; // From auth middleware

    // ✅ User can only update their own profile
    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    // ✅ Prevent users from changing their role
    const { role, ...allowedUpdates } = req.body;

    if (role) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your role",
      });
    }

    const updatedUser = await updateUser(id, allowedUpdates);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("UpdateMe error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
};

// @desc Delete user by ID
export const deleteMe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ✅ Get from URL params
    const userId = (req as any).user.id; // From auth middleware

    // ✅ User can only delete their own account
    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own account",
      });
    }

    await deleteUser(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("DeleteMe error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};

// @desc Get all users
export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    console.error("GetAllUsers error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};
