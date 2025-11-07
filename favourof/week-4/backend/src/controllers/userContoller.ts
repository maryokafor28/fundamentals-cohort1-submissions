import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import {
  requestLoggerInstance,
  securityLoggerInstance,
} from "../utils/loggers";
import AppError from "../utils/AppError";

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const updates = req.body;
    const allowedFields = [
      "name",
      "avatar",
      "bio",
      "skills",
      "LinkedIn",
      "github",
    ];
    const filteredUpdates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) filteredUpdates[field] = updates[field];
    }

    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken -failedLoginAttempts -lockUntil");

    if (!updatedUser) {
      securityLoggerInstance.warn("INVALID_USER_UPDATE", {
        ip: req.ip,
      });
      if (!updatedUser) return next(new AppError("No user found", 404));
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    requestLoggerInstance.error("UPDATE USER ERROR", {
      error: (err as Error).message,
      ip: req.ip,
    });
    next(err);
  }
};
