import { Request, Response } from "express";
import { Meal, User } from "../models/index.js";

export const createMeal = async (req: Request, res: Response) => {
  try {
    const { email, type, name, calories, protein, fat, carbs, date } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newMeal = await Meal.create({
      user: existingUser._id,
      type,
      name,
      calories,
      protein,
      fat,
      carbs,
      date,
    });

    existingUser.meals.push(newMeal.id);
    await existingUser.save();

    const populateMeal = await newMeal.populate("user");
    res.status(201).json(populateMeal);
  } catch (error) {
    res.status(400).json({ message: "Error creating meal", error });
  }
};

export const getMeals = async (_req: Request, res: Response) => {
  try {
    const meals = await Meal.find().populate("user", "name");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meals", error });
  }
};

export const getMealById = async (req: Request, res: Response) => {
  try {
    const meal = await Meal.findById(req.params.id).populate("user");
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meal", error });
  }
};

export const updateMeal = async (req: Request, res: Response) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    res.json(meal);
  } catch (error) {
    res.status(400).json({ message: "Error updating meal", error });
  }
};

export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal", error });
  }
};
