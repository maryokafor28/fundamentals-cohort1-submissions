const express = require('express');
const { body, validationResult } = require('express-validator');
const Meal = require('../models/Meal');
const router = express.Router();

// Validation middleware
const validateMeal = [
  body('user').isMongoId().withMessage('Valid user ID is required'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('type').isIn(['breakfast', 'lunch', 'dinner', 'snack', 'other']).withMessage('Please select a valid meal type'),
  body('foodItems').isArray({ min: 1 }).withMessage('At least one food item is required'),
  body('foodItems.*.name').trim().isLength({ min: 1 }).withMessage('Food item name is required'),
  body('foodItems.*.quantity.amount').isFloat({ min: 0 }).withMessage('Quantity amount must be positive'),
  body('foodItems.*.quantity.unit').isIn(['grams', 'kg', 'oz', 'lbs', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'ml', 'liter']).withMessage('Please select a valid unit'),
  body('foodItems.*.nutrition.calories').isFloat({ min: 0 }).withMessage('Calories must be positive'),
  body('mealDate').optional().isISO8601().withMessage('Please provide a valid meal date'),
  body('servings').optional().isInt({ min: 1 }).withMessage('Servings must be at least 1')
];

const validateMealUpdate = [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('type').optional().isIn(['breakfast', 'lunch', 'dinner', 'snack', 'other']).withMessage('Please select a valid meal type'),
  body('foodItems').optional().isArray({ min: 1 }).withMessage('At least one food item is required'),
  body('mealDate').optional().isISO8601().withMessage('Please provide a valid meal date'),
  body('servings').optional().isInt({ min: 1 }).withMessage('Servings must be at least 1'),
  body('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/meals
// @desc    Get all meals with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const user = req.query.user;
    const type = req.query.type;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const sortBy = req.query.sortBy || 'mealDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    let query = {};
    
    if (user) {
      query.user = user;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (dateFrom || dateTo) {
      query.mealDate = {};
      if (dateFrom) query.mealDate.$gte = new Date(dateFrom);
      if (dateTo) query.mealDate.$lte = new Date(dateTo);
    }

    const meals = await Meal.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email profileImage');

    const total = await Meal.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: meals,
      pagination: {
        currentPage: page,
        totalPages,
        totalMeals: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meals',
      error: error.message
    });
  }
});

// @route   GET /api/meals/:id
// @desc    Get meal by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate('user', 'name email profileImage');
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Error fetching meal:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching meal',
      error: error.message
    });
  }
});

// @route   POST /api/meals
// @desc    Create new meal
// @access  Public
router.post('/', validateMeal, handleValidationErrors, async (req, res) => {
  try {
    const meal = new Meal(req.body);
    await meal.save();

    const populatedMeal = await Meal.findById(meal._id)
      .populate('user', 'name email profileImage');

    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: populatedMeal
    });
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating meal',
      error: error.message
    });
  }
});

// @route   PUT /api/meals/:id
// @desc    Update meal
// @access  Public
router.put('/:id', validateMealUpdate, handleValidationErrors, async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('user', 'name email profileImage');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: meal
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating meal',
      error: error.message
    });
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete meal
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
      data: meal
    });
  } catch (error) {
    console.error('Error deleting meal:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting meal',
      error: error.message
    });
  }
});

// @route   GET /api/meals/user/:userId/stats
// @desc    Get user meal statistics and nutrition summary
// @access  Public
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const userId = req.params.userId;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    // Build date query
    let dateQuery = {};
    if (dateFrom || dateTo) {
      dateQuery.mealDate = {};
      if (dateFrom) dateQuery.mealDate.$gte = new Date(dateFrom);
      if (dateTo) dateQuery.mealDate.$lte = new Date(dateTo);
    }

    const meals = await Meal.find({
      user: userId,
      ...dateQuery
    });

    if (meals.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalMeals: 0,
          totalCalories: 0,
          averageCaloriesPerMeal: 0,
          mealsByType: {},
          nutritionSummary: {},
          favoriteLocation: null,
          averageRating: 0
        }
      });
    }

    // Calculate statistics
    const totalMeals = meals.length;
    const totalCalories = meals.reduce((sum, meal) => sum + (meal.totalNutrition?.calories || 0), 0);

    // Nutrition summary
    const nutritionSummary = meals.reduce((acc, meal) => {
      const nutrition = meal.totalNutrition || {};
      acc.calories = (acc.calories || 0) + (nutrition.calories || 0);
      acc.protein = (acc.protein || 0) + (nutrition.protein || 0);
      acc.carbohydrates = (acc.carbohydrates || 0) + (nutrition.carbohydrates || 0);
      acc.fat = (acc.fat || 0) + (nutrition.fat || 0);
      acc.fiber = (acc.fiber || 0) + (nutrition.fiber || 0);
      acc.sugar = (acc.sugar || 0) + (nutrition.sugar || 0);
      acc.sodium = (acc.sodium || 0) + (nutrition.sodium || 0);
      return acc;
    }, {});

    // Round nutrition values
    Object.keys(nutritionSummary).forEach(key => {
      nutritionSummary[key] = Math.round(nutritionSummary[key] * 100) / 100;
    });

    // Meals by type
    const mealsByType = meals.reduce((acc, meal) => {
      acc[meal.type] = (acc[meal.type] || 0) + 1;
      return acc;
    }, {});

    // Favorite location
    const locationCount = meals.reduce((acc, meal) => {
      if (meal.location) {
        acc[meal.location] = (acc[meal.location] || 0) + 1;
      }
      return acc;
    }, {});

    const favoriteLocation = Object.keys(locationCount).reduce((a, b) => 
      locationCount[a] > locationCount[b] ? a : b, Object.keys(locationCount)[0] || null
    );

    // Average rating
    const ratedMeals = meals.filter(meal => meal.rating);
    const averageRating = ratedMeals.length > 0 
      ? Math.round((ratedMeals.reduce((sum, meal) => sum + meal.rating, 0) / ratedMeals.length) * 10) / 10
      : 0;

    // Most consumed food categories
    const foodCategories = meals.reduce((acc, meal) => {
      meal.foodItems?.forEach(item => {
        if (item.category) {
          acc[item.category] = (acc[item.category] || 0) + 1;
        }
      });
      return acc;
    }, {});

    const stats = {
      totalMeals,
      totalCalories: Math.round(totalCalories),
      averageCaloriesPerMeal: Math.round(totalCalories / totalMeals),
      mealsByType,
      nutritionSummary,
      favoriteLocation,
      averageRating,
      foodCategories
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching meal stats:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching meal stats',
      error: error.message
    });
  }
});

// @route   GET /api/meals/user/:userId/nutrition/:date
// @desc    Get daily nutrition summary for a specific date
// @access  Public
router.get('/user/:userId/nutrition/:date', async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = new Date(req.params.date);
    
    // Set date range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: userId,
      mealDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ mealDate: 1 });

    // Calculate daily totals
    const dailyNutrition = meals.reduce((acc, meal) => {
      const nutrition = meal.totalNutrition || {};
      acc.calories = (acc.calories || 0) + (nutrition.calories || 0);
      acc.protein = (acc.protein || 0) + (nutrition.protein || 0);
      acc.carbohydrates = (acc.carbohydrates || 0) + (nutrition.carbohydrates || 0);
      acc.fat = (acc.fat || 0) + (nutrition.fat || 0);
      acc.fiber = (acc.fiber || 0) + (nutrition.fiber || 0);
      acc.sugar = (acc.sugar || 0) + (nutrition.sugar || 0);
      acc.sodium = (acc.sodium || 0) + (nutrition.sodium || 0);
      return acc;
    }, {});

    // Round values
    Object.keys(dailyNutrition).forEach(key => {
      dailyNutrition[key] = Math.round(dailyNutrition[key] * 100) / 100;
    });

    // Nutritional goals (example values, can be customized per user)
    const goals = {
      calories: 2000,
      protein: 150,
      carbohydrates: 250,
      fat: 65,
      fiber: 25,
      sugar: 50,
      sodium: 2300
    };

    // Calculate progress percentages
    const progress = {};
    Object.keys(goals).forEach(key => {
      progress[key] = goals[key] > 0 ? Math.round(((dailyNutrition[key] || 0) / goals[key]) * 100) : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        date: date.toISOString().split('T')[0],
        mealsCount: meals.length,
        dailyNutrition,
        goals,
        progress,
        meals: meals.map(meal => ({
          _id: meal._id,
          title: meal.title,
          type: meal.type,
          mealDate: meal.mealDate,
          totalNutrition: meal.totalNutrition
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching daily nutrition:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily nutrition',
      error: error.message
    });
  }
});

// @route   GET /api/meals/types
// @desc    Get all available meal types
// @access  Public
router.get('/types', (req, res) => {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'other'];

  res.status(200).json({
    success: true,
    data: mealTypes
  });
});

module.exports = router;
