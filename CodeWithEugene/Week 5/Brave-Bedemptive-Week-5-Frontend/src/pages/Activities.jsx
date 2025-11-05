import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Plus,
  Search,
  Filter,
  Activity as ActivityIcon,
  Calendar,
  Clock,
  Flame,
  MapPin,
  MoreHorizontal
} from 'lucide-react'
import { activityApi } from '../lib/api'
import { formatDate, formatDateTime, getActivityIcon, getIntensityColor, debounce } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Activities() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [intensity, setIntensity] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('activityDate')
  const [sortOrder, setSortOrder] = useState('desc')

  const { data: activityTypes } = useQuery('activity-types', activityApi.getTypes)

  const { data, isLoading, error, refetch } = useQuery(
    ['activities', { type, intensity, page, sortBy, sortOrder }],
    () => activityApi.getAll({ 
      type: type || undefined,
      intensity: intensity || undefined,
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

  const intensityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'very_high', label: 'Very High' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Activities</h1>
          <p className="text-neutral-600 mt-1">
            Track and manage fitness activities and workouts
          </p>
        </div>
        <Link to="/activities/new" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Log Activity
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
              <option value="">All Activities</option>
              {activityTypes?.data?.map((activityType) => (
                <option key={activityType} value={activityType}>
                  {getActivityIcon(activityType)} {activityType.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              className="select"
              value={intensity}
              onChange={(e) => {
                setIntensity(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Intensities</option>
              {intensityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              <option value="activityDate-desc">Recent First</option>
              <option value="activityDate-asc">Oldest First</option>
              <option value="duration-desc">Longest Duration</option>
              <option value="caloriesBurned-desc">Most Calories</option>
            </select>
          </div>

          <div>
            <Link to="/activities/new" className="btn-outline w-full justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Log Activity
            </Link>
          </div>
        </div>
      </div>

      {/* Activities List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {data?.data?.length > 0 ? (
            <>
              {data.data.map((activity) => (
                <div key={activity._id} className="card-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-neutral-900">
                            {activity.title}
                          </h3>
                          <span className={`badge badge-${getIntensityColor(activity.intensity)}`}>
                            {activity.intensity.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-neutral-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(activity.activityDate)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {activity.duration} mins
                          </div>
                          {activity.caloriesBurned > 0 && (
                            <div className="flex items-center">
                              <Flame className="w-4 h-4 mr-1" />
                              {activity.caloriesBurned} cal
                            </div>
                          )}
                          {activity.distance?.value > 0 && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {activity.distance.value} {activity.distance.unit}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-neutral-500 mt-1">
                          by {activity.user?.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/activities/${activity._id}`}
                        className="btn-ghost btn-sm"
                      >
                        View Details
                      </Link>
                      <button className="btn-ghost btn-sm p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {activity.description && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <p className="text-neutral-600 text-sm">{activity.description}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {data.pagination && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    Showing {((data.pagination.currentPage - 1) * 10) + 1} to{' '}
                    {Math.min(data.pagination.currentPage * 10, data.pagination.totalActivities)} of{' '}
                    {data.pagination.totalActivities} activities
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
              <ActivityIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No activities found</h3>
              <p className="text-neutral-500 mb-4">
                {type || intensity ? 'Try adjusting your filters.' : 'Get started by logging your first activity.'}
              </p>
              <Link to="/activities/new" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Log Activity
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
