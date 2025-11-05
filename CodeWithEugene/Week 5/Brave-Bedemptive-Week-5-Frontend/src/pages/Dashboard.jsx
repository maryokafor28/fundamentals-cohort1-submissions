import { useQuery } from 'react-query'
import { 
  Users, 
  Activity, 
  UtensilsCrossed, 
  Calendar,
  TrendingUp,
  Heart,
  Target,
  Clock
} from 'lucide-react'
import { userApi, activityApi, mealApi, appointmentApi } from '../lib/api'
import { formatNumber, formatDate } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Dashboard() {
  // Fetch dashboard data
  const { data: users, isLoading: usersLoading } = useQuery('dashboard-users', () => 
    userApi.getAll({ limit: 5 })
  )

  const { data: activities, isLoading: activitiesLoading } = useQuery('dashboard-activities', () => 
    activityApi.getAll({ limit: 10, sortBy: 'activityDate', sortOrder: 'desc' })
  )

  const { data: meals, isLoading: mealsLoading } = useQuery('dashboard-meals', () => 
    mealApi.getAll({ limit: 5, sortBy: 'mealDate', sortOrder: 'desc' })
  )

  const { data: appointments, isLoading: appointmentsLoading } = useQuery('dashboard-appointments', () => 
    appointmentApi.getAll({ limit: 5, sortBy: 'appointmentDate', sortOrder: 'asc' })
  )

  const isLoading = usersLoading || activitiesLoading || mealsLoading || appointmentsLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  const stats = [
    {
      name: 'Total Users',
      value: users?.pagination?.totalUsers || 0,
      icon: Users,
      change: '+4.75%',
      changeType: 'positive',
      color: 'bg-blue-500'
    },
    {
      name: 'Activities Today',
      value: activities?.data?.filter(a => 
        new Date(a.activityDate).toDateString() === new Date().toDateString()
      ).length || 0,
      icon: Activity,
      change: '+2.02%',
      changeType: 'positive',
      color: 'bg-green-500'
    },
    {
      name: 'Meals Logged',
      value: meals?.pagination?.totalMeals || 0,
      icon: UtensilsCrossed,
      change: '+1.81%',
      changeType: 'positive',
      color: 'bg-yellow-500'
    },
    {
      name: 'Upcoming Appointments',
      value: appointments?.data?.filter(a => 
        new Date(a.appointmentDate) >= new Date() && 
        !['cancelled', 'completed'].includes(a.status)
      ).length || 0,
      icon: Calendar,
      change: '-0.34%',
      changeType: 'negative',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to PulseTrack</h1>
            <p className="text-primary-100 text-lg">
              Monitor health data, track fitness activities, and manage medical appointments all in one place.
            </p>
          </div>
          <Heart className="w-16 h-16 text-primary-200" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{stat.name}</p>
                <p className="text-3xl font-bold text-neutral-900">{formatNumber(stat.value)}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-neutral-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Recent Activities</h2>
            <Activity className="w-5 h-5 text-neutral-400" />
          </div>
          
          {activities?.data?.length > 0 ? (
            <div className="space-y-4">
              {activities.data.slice(0, 5).map((activity) => (
                <div key={activity._id} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {activity.user?.name} • {activity.duration} mins • {activity.caloriesBurned || 0} cal
                    </p>
                  </div>
                  <div className="text-sm text-neutral-400">
                    {formatDate(activity.activityDate)}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-neutral-200">
                <a href="/activities" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                  View all activities →
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No activities found</p>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Upcoming Appointments</h2>
            <Calendar className="w-5 h-5 text-neutral-400" />
          </div>
          
          {appointments?.data?.length > 0 ? (
            <div className="space-y-4">
              {appointments.data
                .filter(apt => new Date(apt.appointmentDate) >= new Date())
                .slice(0, 5)
                .map((appointment) => (
                <div key={appointment._id} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {appointment.doctor?.name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {appointment.type} • {appointment.patient?.name}
                    </p>
                  </div>
                  <div className="text-sm text-neutral-400">
                    {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-neutral-200">
                <a href="/appointments" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                  View all appointments →
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">New Users</h2>
            <Users className="w-5 h-5 text-neutral-400" />
          </div>
          
          {users?.data?.length > 0 ? (
            <div className="space-y-4">
              {users.data.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium text-sm">
                    {user.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-neutral-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-sm text-neutral-400">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-neutral-200">
                <a href="/users" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                  View all users →
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No users found</p>
            </div>
          )}
        </div>

        {/* Recent Meals */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Recent Meals</h2>
            <UtensilsCrossed className="w-5 h-5 text-neutral-400" />
          </div>
          
          {meals?.data?.length > 0 ? (
            <div className="space-y-4">
              {meals.data.slice(0, 5).map((meal) => (
                <div key={meal._id} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {meal.title}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {meal.user?.name} • {meal.type} • {meal.totalNutrition?.calories || 0} cal
                    </p>
                  </div>
                  <div className="text-sm text-neutral-400">
                    {formatDate(meal.mealDate)}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-neutral-200">
                <a href="/meals" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                  View all meals →
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <UtensilsCrossed className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No meals found</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/users" className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Users className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-neutral-900">Add User</span>
          </a>
          <a href="/activities/new" className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Activity className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-neutral-900">Log Activity</span>
          </a>
          <a href="/meals/new" className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <UtensilsCrossed className="w-8 h-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-neutral-900">Add Meal</span>
          </a>
          <a href="/appointments/new" className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-neutral-900">Book Appointment</span>
          </a>
        </div>
      </div>
    </div>
  )
}
