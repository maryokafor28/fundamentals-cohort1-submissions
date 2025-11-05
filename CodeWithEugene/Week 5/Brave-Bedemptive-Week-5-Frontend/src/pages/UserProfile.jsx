import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  UtensilsCrossed,
  FileText,
  Edit
} from 'lucide-react'
import { userApi, activityApi, mealApi, appointmentApi } from '../lib/api'
import { formatDate, calculateAge, getBMICategory, getBMIColor } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: user, isLoading: userLoading, error: userError } = useQuery(
    ['user', id],
    () => userApi.getById(id)
  )

  const { data: userStats } = useQuery(
    ['user-stats', id],
    () => userApi.getStats(id),
    { enabled: !!user }
  )

  const { data: recentActivities } = useQuery(
    ['user-activities', id],
    () => activityApi.getAll({ user: id, limit: 5, sortBy: 'activityDate', sortOrder: 'desc' }),
    { enabled: !!user }
  )

  const { data: recentMeals } = useQuery(
    ['user-meals', id],
    () => mealApi.getAll({ user: id, limit: 5, sortBy: 'mealDate', sortOrder: 'desc' }),
    { enabled: !!user }
  )

  const { data: upcomingAppointments } = useQuery(
    ['user-appointments', id],
    () => appointmentApi.getUpcoming(id, { limit: 3 }),
    { enabled: !!user }
  )

  if (userLoading) {
    return <LoadingSpinner />
  }

  if (userError) {
    return <ErrorMessage error={userError} onRetry={() => window.location.reload()} />
  }

  const userData = user?.data
  const age = calculateAge(userData?.dateOfBirth)
  const bmiCategory = getBMICategory(userData?.bmi)
  const bmiColor = getBMIColor(userData?.bmi)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/users')}
          className="btn-ghost p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-neutral-900">User Profile</h1>
          <p className="text-neutral-600 mt-1">
            View and manage user health information
          </p>
        </div>
        <button className="btn-outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <div className="card text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl mx-auto mb-4">
              {userData?.name?.[0] || 'U'}
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-1">
              {userData?.name}
            </h2>
            <p className="text-neutral-600 mb-4">{userData?.email}</p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-neutral-400" />
                <span className="text-neutral-600">
                  {age} years old • {userData?.gender}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-neutral-400" />
                <span className="text-neutral-600">{userData?.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
                <span className="text-neutral-600">
                  Joined {formatDate(userData?.createdAt)}
                </span>
              </div>
              {userData?.address && (
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
                  <span className="text-neutral-600">
                    {userData.address.city}, {userData.address.state}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Health Stats Card */}
          <div className="card">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Health Overview</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Height</span>
                <span className="font-medium">{userData?.height} cm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Weight</span>
                <span className="font-medium">{userData?.weight} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">BMI</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{userData?.bmi}</span>
                  <span className={`badge badge-${bmiColor}`}>
                    {bmiCategory}
                  </span>
                </div>
              </div>
              {userStats?.data?.bmr && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">BMR</span>
                  <span className="font-medium">{userStats.data.bmr} cal/day</span>
                </div>
              )}
            </div>
          </div>

          {/* Medical Conditions */}
          {userData?.medicalConditions?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Medical Conditions</h3>
              <div className="space-y-2">
                {userData.medicalConditions.map((condition, index) => (
                  <span key={index} className="badge badge-accent block">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergies */}
          {userData?.allergies?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Allergies</h3>
              <div className="space-y-2">
                {userData.allergies.map((allergy, index) => (
                  <span key={index} className="badge badge-warning block">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activities */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900">Recent Activities</h3>
              <Activity className="w-5 h-5 text-neutral-400" />
            </div>
            
            {recentActivities?.data?.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.data.map((activity) => (
                  <div key={activity._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                        <p className="text-xs text-neutral-500">
                          {activity.duration} mins • {activity.caloriesBurned || 0} cal
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {formatDate(activity.activityDate)}
                    </span>
                  </div>
                ))}
                <button className="btn-ghost btn-sm w-full">
                  View All Activities
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-neutral-500 text-sm">No activities yet</p>
              </div>
            )}
          </div>

          {/* Recent Meals */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900">Recent Meals</h3>
              <UtensilsCrossed className="w-5 h-5 text-neutral-400" />
            </div>
            
            {recentMeals?.data?.length > 0 ? (
              <div className="space-y-3">
                {recentMeals.data.map((meal) => (
                  <div key={meal._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{meal.title}</p>
                        <p className="text-xs text-neutral-500">
                          {meal.type} • {meal.totalNutrition?.calories || 0} cal
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {formatDate(meal.mealDate)}
                    </span>
                  </div>
                ))}
                <button className="btn-ghost btn-sm w-full">
                  View All Meals
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <UtensilsCrossed className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-neutral-500 text-sm">No meals logged yet</p>
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900">Upcoming Appointments</h3>
              <Calendar className="w-5 h-5 text-neutral-400" />
            </div>
            
            {upcomingAppointments?.data?.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.data.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {appointment.doctor?.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {appointment.type} • {appointment.appointmentTime}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {formatDate(appointment.appointmentDate)}
                    </span>
                  </div>
                ))}
                <button className="btn-ghost btn-sm w-full">
                  View All Appointments
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-neutral-500 text-sm">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
