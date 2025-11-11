import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { AppError } from "../utils/appError";

export const userController = {
  // Create a new user
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.body;

      const user = await userService.createUser(name, email);
      res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        // Prisma duplicate constraint
        return next(new AppError("Email already exists", 409));
      }
      next(error);
    }
  },

  // Get users with pagination
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const usersPaginated = await userService.getUsersPaginated(page, limit);

      res.status(200).json({
        status: "success",
        ...usersPaginated,
      });
    } catch (error) {
      next(error);
    }
  },

  //  Get single user by ID
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log("🔍 Looking for user with ID:", id); // Add this

      const user = await userService.getUserById(id);
      console.log("📦 User found:", user); // Add this

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  //  Update user by ID
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const updatedUser = await userService.updateUser(id, name, email);
      if (!updatedUser) {
        return next(new AppError("User not found", 404));
      }

      res.status(200).json({
        status: "success",
        data: updatedUser,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return next(new AppError("Email already exists", 409));
      }
      next(error);
    }
  },

  //  Delete user by ID
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedUser = await userService.deleteUser(id);

      if (!deletedUser) {
        return next(new AppError("User not found", 404));
      }

      res.status(204).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
