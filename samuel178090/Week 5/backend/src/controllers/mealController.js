import Meal from '../models/Meal.js';
import User from '../models/User.js';

// Get all meals
export const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find().populate('user', 'name email').populate('approvedBy', 'name');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get meal by ID
export const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('user', 'name email');
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create meal
export const createMeal = async (req, res) => {
  try {
    const meal = new Meal(req.body);
    const savedMeal = await meal.save();
    
    // Add meal to user's meals array
    await User.findByIdAndUpdate(req.body.user, {
      $push: { meals: savedMeal._id }
    });
    
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update meal
export const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete meal
export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    // Remove meal from user's meals array
    await User.findByIdAndUpdate(meal.user, {
      $pull: { meals: meal._id }
    });
    
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};