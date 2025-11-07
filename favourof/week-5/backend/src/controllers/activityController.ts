import { Request, Response } from "express";
import { Activity } from "../models/activity";
import { User } from "../models/user";

//  Create new activity
export const createActivity = async (req: Request, res: Response) => {
  try {
    const { user, type, durationMinutes, calories, metadata } = req.body;

    // Ensure user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const activity = await Activity.create({
      user,
      type,
      durationMinutes,
      calories,
      metadata,
    });

    return res.status(201).json({
      message: "Activity created successfully",
      data: activity,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Get all activities (for all users)
export const getActivities = async (_req: Request, res: Response) => {
  try {
    const activities = await Activity.find({ isDeleted: false })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: activities.length,
      data: activities,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Get all activities for one user
export const getActivitiesByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const activities = await Activity.find({
      user: userId,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      count: activities.length,
      data: activities,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Update activity
export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, durationMinutes, calories, metadata } = req.body;

    const activity = await Activity.findByIdAndUpdate(
      id,
      { type, durationMinutes, calories, metadata },
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    return res.status(200).json({
      message: "Activity updated successfully",
      data: activity,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Soft delete activity
export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activity.isDeleted = true;
    await activity.save();

    return res.status(200).json({ message: "Activity deleted successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
