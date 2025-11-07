import express from "express";
import {
  createMeal,
  getMeals,
  getMealsByUser,
  updateMeal,
  deleteMeal,
} from "../controllers/mealController";

const router = express.Router();

router.post("/", createMeal);
router.get("/", getMeals);
router.get("/user/:userId", getMealsByUser);
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

export default router;
