import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Plus,
  Search,
  Filter,
  UtensilsCrossed,
  Calendar,
  Clock,
  Flame,
  Users,
  MoreHorizontal
} from 'lucide-react'
import { mealApi } from '../lib/api'
import { formatDate, formatDateTime, debounce } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Meals() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('mealDate')
  const [sortOrder, setSortOrder] = useState('desc')

  const { data: mealTypes } = useQuery('meal-types', mealApi.getTypes)

  const { data, isLoading, error, refetch } = useQuery(
    ['meals', { type, page, sortBy, sortOrder }],
    () => mealApi.getAll({ 
      type: type || undefined,
      page, 
      sortBy, 
      sortOrder,
      limit: 10
    }),
    {
      keepPreviousData: true,
    }
  )

  const handleSearchChange = debounce((value) => {
    setSearch(value)
    setPage(1)
  }, 300)

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />
  }

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: '🥞',
      lunch: '🥗',
      dinner: '🍽️',
      snack: '🍎',
      other: '🍴'
    }
    return icons[mealType] || icons.other
  }

  const getMealTimeColor = (mealType) => {
    const colors = {
      breakfast: 'yellow',
      lunch: 'green',
      dinner: 'blue',
      snack: 'purple',
      other: 'gray'
    }
    return colors[mealType] || 'gray'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Meals</h1>
          <p className="text-neutral-600 mt-1">
            Track nutrition and manage meal logs
          </p>
        </div>
        <Link to="/meals/new" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Log Meal
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <select
              className="select"
              value={type}
              onChange={(e) => {
                setType(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Meal Types</option>
              {mealTypes?.data?.map((mealType) => (
                <option key={mealType} value={mealType}>
                  {getMealIcon(mealType)} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
                setPage(1)
              }}
            >
              <option value="mealDate-desc">Recent First</option>
              <option value="mealDate-asc">Oldest First</option>
              <option value="totalNutrition.calories-desc">Most Calories</option>
              <option value="totalNutrition.calories-asc">Least Calories</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              className="input"
              placeholder="Filter by date"
            />
          </div>

          <div>
            <Link to="/meals/new" className="btn-outline w-full justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Log Meal
            </Link>
          </div>
        </div>
      </div>

      {/* Meals List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {data?.data?.length > 0 ? (
            <>
              {data.data.map((meal) => (
                <div key={meal._id} className="card-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-${getMealTimeColor(meal.type)}-100 rounded-lg flex items-center justify-center text-2xl`}>
                        {getMealIcon(meal.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-neutral-900">
                            {meal.title}
                          </h3>
                          <span className={`badge badge-${getMealTimeColor(meal.type)}`}>
                            {meal.type}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-neutral-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(meal.mealDate)}
                          </div>
                          <div className="flex items-center">
                            <Flame className="w-4 h-4 mr-1" />
                            {meal.totalNutrition?.calories || 0} cal
                          </div>
                          {meal.totalNutrition?.protein > 0 && (
                            <div>
                              Protein: {meal.totalNutrition.protein}g
                            </div>
                          )}
                          {meal.servings > 1 && (
                            <div>
                              {meal.servings} servings
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-neutral-500">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            by {meal.user?.name}
                          </div>
                          {meal.location && (
                            <div>
                              at {meal.location}
                            </div>
                          )}
                          {meal.rating && (
                            <div>
                              ⭐ {meal.rating}/5
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/meals/${meal._id}`}
                        className="btn-ghost btn-sm"
                      >
                        View Details
                      </Link>
                      <button className="btn-ghost btn-sm p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Food Items Preview */}
                  {meal.foodItems && meal.foodItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex flex-wrap gap-2">
                        {meal.foodItems.slice(0, 3).map((item, index) => (
                          <span key={index} className="badge badge-secondary">
                            {item.name} ({item.quantity.amount}{item.quantity.unit})
                          </span>
                        ))}
                        {meal.foodItems.length > 3 && (
                          <span className="text-sm text-neutral-500">
                            +{meal.foodItems.length - 3} more items
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Nutrition Summary */}
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">
                          {meal.totalNutrition?.calories || 0}
                        </div>
                        <div className="text-xs text-neutral-500">Calories</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">
                          {meal.totalNutrition?.protein || 0}g
                        </div>
                        <div className="text-xs text-neutral-500">Protein</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">
                          {meal.totalNutrition?.carbohydrates || 0}g
                        </div>
                        <div className="text-xs text-neutral-500">Carbs</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">
                          {meal.totalNutrition?.fat || 0}g
                        </div>
                        <div className="text-xs text-neutral-500">Fat</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {data.pagination && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    Showing {((data.pagination.currentPage - 1) * 10) + 1} to{' '}
                    {Math.min(data.pagination.currentPage * 10, data.pagination.totalMeals)} of{' '}
                    {data.pagination.totalMeals} meals
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={!data.pagination.hasPrevPage}
                      className="btn-outline btn-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm text-neutral-600">
                      Page {data.pagination.currentPage} of {data.pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!data.pagination.hasNextPage}
                      className="btn-outline btn-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-12">
              <UtensilsCrossed className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No meals found</h3>
              <p className="text-neutral-500 mb-4">
                {type ? 'Try adjusting your filters.' : 'Get started by logging your first meal.'}
              </p>
              <Link to="/meals/new" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Log Meal
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
