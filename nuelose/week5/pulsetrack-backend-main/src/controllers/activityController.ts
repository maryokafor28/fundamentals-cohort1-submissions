import { Request, Response } from "express";
import { Activity, User } from "../models/index.js";

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { email, type, duration, caloriesBurned, date } = req.body;

    const existingUser = await User.findOne({email});
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newActivity = await Activity.create({
      user:existingUser._id,
      type,
      duration,
      caloriesBurned,
      date,
    });

    existingUser.activities.push(newActivity.id);
    await existingUser.save();

    const populatedActivity = await newActivity.populate("user");
    res.status(201).json(populatedActivity);
  } catch (error) {
    res.status(400).json({ message: "Error creating activity", error });
  }
};

export const getActivities = async (_req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate("user", "name");
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id).populate("user");
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity", error });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: "Error updating activity", error });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity", error });
  }
};
