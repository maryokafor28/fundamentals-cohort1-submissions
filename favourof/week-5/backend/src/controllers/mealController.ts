import { Request, Response } from "express";
import { Meal } from "../models/meal";
import { User } from "../models/user";

//  Create new meal
export const createMeal = async (req: Request, res: Response) => {
  try {
    const { user, title, items, time } = req.body;

    // Check if user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create meal
    const meal = await Meal.create({ user, title, items, time });

    return res.status(201).json({
      message: "Meal logged successfully",
      data: meal,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

//  Get all meals
export const getMeals = async (_req: Request, res: Response) => {
  try {
    const meals = await Meal.find({ isDeleted: false })
      .populate("user", "name email")
      .sort({ time: -1 });

    return res.status(200).json({
      count: meals.length,
      data: meals,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Get meals by user
export const getMealsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const meals = await Meal.find({ user: userId, isDeleted: false }).sort({
      time: -1,
    });

    return res.status(200).json({
      count: meals.length,
      data: meals,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Update meal
export const updateMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, items, time } = req.body;

    const meal = await Meal.findByIdAndUpdate(
      id,
      { title, items, time },
      { new: true, runValidators: true }
    );

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Trigger auto totalCalories calculation
    await meal.save();

    return res.status(200).json({
      message: "Meal updated successfully",
      data: meal,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Soft delete meal
export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    meal.isDeleted = true;
    await meal.save();

    return res.status(200).json({ message: "Meal deleted successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
