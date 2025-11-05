import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Plus, Trash2, Calculator } from 'lucide-react'
import { mealApi, userApi } from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CreateMeal() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      mealDate: new Date().toISOString().split('T')[0],
      type: 'breakfast',
      servings: 1,
      location: 'home',
      foodItems: [
        {
          name: '',
          quantity: { amount: '', unit: 'grams' },
          nutrition: { calories: '', protein: 0, carbohydrates: 0, fat: 0 },
          category: 'other'
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'foodItems'
  })

  const watchedFoodItems = watch('foodItems')

  // Fetch users for selection
  const { data: users } = useQuery('users-select', () => 
    userApi.getAll({ limit: 100 })
  )

  // Fetch meal types
  const { data: mealTypes } = useQuery('meal-types', mealApi.getTypes)

  const createMealMutation = useMutation(mealApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('meals')
      toast.success('Meal logged successfully!')
      navigate('/meals')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create meal')
    }
  })

  const onSubmit = (data) => {
    const mealData = {
      ...data,
      servings: parseInt(data.servings),
      foodItems: data.foodItems.map(item => ({
        ...item,
        quantity: {
          amount: parseFloat(item.quantity.amount),
          unit: item.quantity.unit
        },
        nutrition: {
          calories: parseFloat(item.nutrition.calories) || 0,
          protein: parseFloat(item.nutrition.protein) || 0,
          carbohydrates: parseFloat(item.nutrition.carbohydrates) || 0,
          fat: parseFloat(item.nutrition.fat) || 0,
          fiber: parseFloat(item.nutrition.fiber) || 0,
          sugar: parseFloat(item.nutrition.sugar) || 0,
          sodium: parseFloat(item.nutrition.sodium) || 0
        }
      })),
      prepTime: data.prepTime ? parseInt(data.prepTime) : undefined,
      cookTime: data.cookTime ? parseInt(data.cookTime) : undefined,
      rating: data.rating ? parseInt(data.rating) : undefined
    }

    createMealMutation.mutate(mealData)
  }

  const calculateTotalNutrition = () => {
    return watchedFoodItems.reduce((total, item) => {
      const nutrition = item.nutrition || {}
      return {
        calories: total.calories + (parseFloat(nutrition.calories) || 0),
        protein: total.protein + (parseFloat(nutrition.protein) || 0),
        carbohydrates: total.carbohydrates + (parseFloat(nutrition.carbohydrates) || 0),
        fat: total.fat + (parseFloat(nutrition.fat) || 0)
      }
    }, { calories: 0, protein: 0, carbohydrates: 0, fat: 0 })
  }

  const totalNutrition = calculateTotalNutrition()

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast', icon: '🥞' },
    { value: 'lunch', label: 'Lunch', icon: '🥗' },
    { value: 'dinner', label: 'Dinner', icon: '🍽️' },
    { value: 'snack', label: 'Snack', icon: '🍎' },
    { value: 'other', label: 'Other', icon: '🍴' }
  ]

  const quantityUnits = [
    'grams', 'kg', 'oz', 'lbs', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'ml', 'liter'
  ]

  const foodCategories = [
    'fruits', 'vegetables', 'grains', 'protein', 'dairy',
    'nuts_seeds', 'beverages', 'snacks', 'desserts',
    'oils_fats', 'herbs_spices', 'condiments', 'other'
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/meals')}
          className="btn-ghost p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Log New Meal</h1>
          <p className="text-neutral-600 mt-1">
            Track your nutrition and meal information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">User *</label>
              <select 
                {...register('user', { required: 'User is required' })}
                className={`select ${errors.user ? 'input-error' : ''}`}
              >
                <option value="">Select user</option>
                {users?.data?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.user && <p className="form-error">{errors.user.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Meal Type *</label>
              <select 
                {...register('type', { required: 'Meal type is required' })}
                className={`select ${errors.type ? 'input-error' : ''}`}
              >
                {mealTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="form-error">{errors.type.message}</p>}
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Meal Title *</label>
              <input
                type="text"
                placeholder="e.g., Grilled Chicken Salad"
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                })}
                className={`input ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                {...register('mealDate', { required: 'Date is required' })}
                className={`input ${errors.mealDate ? 'input-error' : ''}`}
              />
              {errors.mealDate && <p className="form-error">{errors.mealDate.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Servings *</label>
              <input
                type="number"
                min="1"
                {...register('servings', { 
                  required: 'Servings is required',
                  min: { value: 1, message: 'Servings must be at least 1' }
                })}
                className={`input ${errors.servings ? 'input-error' : ''}`}
              />
              {errors.servings && <p className="form-error">{errors.servings.message}</p>}
            </div>
          </div>
        </div>

        {/* Food Items */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-neutral-900">Food Items</h2>
            <button
              type="button"
              onClick={() => append({
                name: '',
                quantity: { amount: '', unit: 'grams' },
                nutrition: { calories: '', protein: 0, carbohydrates: 0, fat: 0 },
                category: 'other'
              })}
              className="btn-outline btn-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-neutral-900">Food Item {index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn-ghost btn-sm p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Food Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Chicken breast"
                      {...register(`foodItems.${index}.name`, { 
                        required: 'Food name is required' 
                      })}
                      className={`input ${errors.foodItems?.[index]?.name ? 'input-error' : ''}`}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="150"
                        {...register(`foodItems.${index}.quantity.amount`, { 
                          required: 'Amount is required',
                          min: { value: 0, message: 'Amount must be positive' }
                        })}
                        className="input"
                      />
                      <select 
                        {...register(`foodItems.${index}.quantity.unit`)}
                        className="select"
                      >
                        {quantityUnits.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      {...register(`foodItems.${index}.category`)}
                      className="select"
                    >
                      {foodCategories.map(category => (
                        <option key={category} value={category}>
                          {category.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Calories *</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="165"
                      {...register(`foodItems.${index}.nutrition.calories`, { 
                        required: 'Calories is required',
                        min: { value: 0, message: 'Calories must be positive' }
                      })}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="31"
                      {...register(`foodItems.${index}.nutrition.protein`)}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0"
                      {...register(`foodItems.${index}.nutrition.carbohydrates`)}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="3.6"
                      {...register(`foodItems.${index}.nutrition.fat`)}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fiber (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      {...register(`foodItems.${index}.nutrition.fiber`)}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sugar (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      {...register(`foodItems.${index}.nutrition.sugar`)}
                      className="input"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nutrition Summary */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Calculator className="w-4 h-4 mr-2" />
              <h3 className="font-medium text-neutral-900">Total Nutrition</h3>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {Math.round(totalNutrition.calories)}
                </div>
                <div className="text-sm text-neutral-600">Calories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(totalNutrition.protein * 10) / 10}g
                </div>
                <div className="text-sm text-neutral-600">Protein</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(totalNutrition.carbohydrates * 10) / 10}g
                </div>
                <div className="text-sm text-neutral-600">Carbs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Math.round(totalNutrition.fat * 10) / 10}g
                </div>
                <div className="text-sm text-neutral-600">Fat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Details */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Optional Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Location</label>
              <select {...register('location')} className="select">
                <option value="home">Home</option>
                <option value="restaurant">Restaurant</option>
                <option value="work">Work</option>
                <option value="school">School</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Rating (1-5)</label>
              <select {...register('rating')} className="select">
                <option value="">No rating</option>
                <option value="1">⭐ 1 - Poor</option>
                <option value="2">⭐⭐ 2 - Fair</option>
                <option value="3">⭐⭐⭐ 3 - Good</option>
                <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Prep Time (minutes)</label>
              <input
                type="number"
                min="0"
                placeholder="15"
                {...register('prepTime')}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cook Time (minutes)</label>
              <input
                type="number"
                min="0"
                placeholder="20"
                {...register('cookTime')}
                className="input"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Notes</label>
              <textarea
                rows={3}
                placeholder="Any additional notes about the meal..."
                {...register('notes')}
                className="textarea"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/meals')}
            className="btn-outline"
            disabled={createMealMutation.isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMealMutation.isLoading}
            className="btn-primary"
          >
            {createMealMutation.isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Log Meal
          </button>
        </div>
      </form>
    </div>
  )
}
