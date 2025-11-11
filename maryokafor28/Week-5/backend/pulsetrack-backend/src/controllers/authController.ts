import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  deleteAllUsers as deleteAllUsersService,
} from "../services/authService";

// @desc Register a new user
// @route POST /api/auth/signup
// @access Public
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // ✅ Validate role if provided
    if (role && !["user", "doctor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'doctor'",
      });
    }

    const result = await registerUser(name, email, password, role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Error registering user",
    });
  }
};

// @desc Login user
// @route POST /api/auth/signin
// @access Public
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    console.error("Signin error:", error.message);
    res.status(401).json({
      success: false,
      message: error.message || "Error logging in",
    });
  }
};

// @desc Get current logged-in user
// @route GET /api/auth/me
// @access Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("GetMe error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
    });
  }
};

// @desc Delete all users (DEVELOPMENT ONLY!)
// @route POST /api/auth/delete-all-users
// @access Backend only (requires secret key)
export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    // ⚠️ SECURITY: Require a secret key that's NOT exposed to frontend
    const { secretKey } = req.body;

    const BACKEND_SECRET =
      process.env.DELETE_ALL_SECRET || "your-super-secret-key-here";

    if (secretKey !== BACKEND_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Invalid secret key",
      });
    }

    const result = await deleteAllUsersService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Delete all users error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting users",
    });
  }
};
