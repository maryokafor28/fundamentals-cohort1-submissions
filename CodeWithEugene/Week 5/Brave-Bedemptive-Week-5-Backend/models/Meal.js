const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  calories: {
    type: Number,
    required: [true, 'Calories are required'],
    min: [0, 'Calories cannot be negative']
  },
  protein: {
    type: Number,
    min: [0, 'Protein cannot be negative'],
    default: 0
  },
  carbohydrates: {
    type: Number,
    min: [0, 'Carbohydrates cannot be negative'],
    default: 0
  },
  fat: {
    type: Number,
    min: [0, 'Fat cannot be negative'],
    default: 0
  },
  fiber: {
    type: Number,
    min: [0, 'Fiber cannot be negative'],
    default: 0
  },
  sugar: {
    type: Number,
    min: [0, 'Sugar cannot be negative'],
    default: 0
  },
  sodium: {
    type: Number,
    min: [0, 'Sodium cannot be negative'],
    default: 0
  },
  vitamins: {
    vitaminA: { type: Number, default: 0 },
    vitaminC: { type: Number, default: 0 },
    vitaminD: { type: Number, default: 0 },
    vitaminE: { type: Number, default: 0 },
    vitaminK: { type: Number, default: 0 },
    vitaminB12: { type: Number, default: 0 }
  },
  minerals: {
    calcium: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    magnesium: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    zinc: { type: Number, default: 0 }
  }
});

const FoodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true
  },
  quantity: {
    amount: {
      type: Number,
      required: [true, 'Food quantity amount is required'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Food quantity unit is required'],
      enum: ['grams', 'kg', 'oz', 'lbs', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'ml', 'liter']
    }
  },
  nutrition: {
    type: NutritionSchema,
    required: true
  },
  category: {
    type: String,
    enum: [
      'fruits', 'vegetables', 'grains', 'protein', 'dairy',
      'nuts_seeds', 'beverages', 'snacks', 'desserts',
      'oils_fats', 'herbs_spices', 'condiments', 'other'
    ],
    default: 'other'
  },
  barcode: String,
  brand: String
});

const MealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Meal title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Meal type is required'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other']
  },
  foodItems: [FoodItemSchema],
  totalNutrition: {
    type: NutritionSchema,
    required: true
  },
  mealDate: {
    type: Date,
    required: [true, 'Meal date is required'],
    default: Date.now
  },
  prepTime: {
    type: Number,
    min: [0, 'Prep time cannot be negative']
  },
  cookTime: {
    type: Number,
    min: [0, 'Cook time cannot be negative']
  },
  servings: {
    type: Number,
    default: 1,
    min: [1, 'Servings must be at least 1']
  },
  recipe: {
    ingredients: [{
      name: String,
      amount: String
    }],
    instructions: [{
      step: Number,
      description: String
    }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  },
  location: {
    type: String,
    enum: ['home', 'restaurant', 'work', 'school', 'other'],
    default: 'home'
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isHealthy: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total cooking time
MealSchema.virtual('totalTime').get(function() {
  return (this.prepTime || 0) + (this.cookTime || 0);
});

// Virtual for calories per serving
MealSchema.virtual('caloriesPerServing').get(function() {
  if (this.totalNutrition && this.totalNutrition.calories && this.servings) {
    return Number((this.totalNutrition.calories / this.servings).toFixed(1));
  }
  return 0;
});

// Calculate total nutrition before saving
MealSchema.pre('save', function(next) {
  if (this.foodItems && this.foodItems.length > 0) {
    const totalNutrition = this.foodItems.reduce((total, item) => {
      const nutrition = item.nutrition;
      return {
        calories: total.calories + (nutrition.calories || 0),
        protein: total.protein + (nutrition.protein || 0),
        carbohydrates: total.carbohydrates + (nutrition.carbohydrates || 0),
        fat: total.fat + (nutrition.fat || 0),
        fiber: total.fiber + (nutrition.fiber || 0),
        sugar: total.sugar + (nutrition.sugar || 0),
        sodium: total.sodium + (nutrition.sodium || 0),
        vitamins: {
          vitaminA: total.vitamins.vitaminA + (nutrition.vitamins?.vitaminA || 0),
          vitaminC: total.vitamins.vitaminC + (nutrition.vitamins?.vitaminC || 0),
          vitaminD: total.vitamins.vitaminD + (nutrition.vitamins?.vitaminD || 0),
          vitaminE: total.vitamins.vitaminE + (nutrition.vitamins?.vitaminE || 0),
          vitaminK: total.vitamins.vitaminK + (nutrition.vitamins?.vitaminK || 0),
          vitaminB12: total.vitamins.vitaminB12 + (nutrition.vitamins?.vitaminB12 || 0)
        },
        minerals: {
          calcium: total.minerals.calcium + (nutrition.minerals?.calcium || 0),
          iron: total.minerals.iron + (nutrition.minerals?.iron || 0),
          magnesium: total.minerals.magnesium + (nutrition.minerals?.magnesium || 0),
          potassium: total.minerals.potassium + (nutrition.minerals?.potassium || 0),
          zinc: total.minerals.zinc + (nutrition.minerals?.zinc || 0)
        }
      };
    }, {
      calories: 0, protein: 0, carbohydrates: 0, fat: 0,
      fiber: 0, sugar: 0, sodium: 0,
      vitamins: { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB12: 0 },
      minerals: { calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0 }
    });
    
    this.totalNutrition = totalNutrition;
  }
  next();
});

// Index for efficient queries
MealSchema.index({ user: 1, mealDate: -1 });
MealSchema.index({ type: 1 });
MealSchema.index({ mealDate: -1 });

// Pre-populate user information
MealSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email profileImage'
  });
  next();
});

module.exports = mongoose.model('Meal', MealSchema);
