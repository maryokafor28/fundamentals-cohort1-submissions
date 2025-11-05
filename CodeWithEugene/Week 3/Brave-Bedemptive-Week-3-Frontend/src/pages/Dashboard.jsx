import { useTaskStats } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Shield
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user, isAdmin } = useAuth()
  const { data: stats, isLoading, error } = useTaskStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading dashboard
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.message}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Tasks',
      value: stats?.data?.totalTasks || 0,
      icon: CheckSquare,
      color: 'bg-blue-500',
    },
    {
      name: 'Completed',
      value: stats?.data?.statusBreakdown?.completed || 0,
      icon: CheckSquare,
      color: 'bg-green-500',
    },
    {
      name: 'In Progress',
      value: stats?.data?.statusBreakdown?.['in-progress'] || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Overdue',
      value: stats?.data?.overdueTasks || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your tasks today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isAdmin() && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </div>
            )}
            <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Users className="w-4 h-4" />
              <span>{user?.role === 'admin' ? 'Admin' : 'User'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats?.data?.priorityBreakdown || {}).map(([priority, count]) => (
            <div key={priority} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  priority === 'high' ? 'bg-red-500' :
                  priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <span className="font-medium text-gray-900 capitalize">{priority}</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/tasks"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckSquare className="w-5 h-5 text-blue-500 mr-3" />
            <span className="font-medium text-gray-900">View All Tasks</span>
          </a>
          
          <a
            href="/tasks?status=pending"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Clock className="w-5 h-5 text-yellow-500 mr-3" />
            <span className="font-medium text-gray-900">Pending Tasks</span>
          </a>
          
          <a
            href="/tasks?status=completed"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
            <span className="font-medium text-gray-900">Completed Tasks</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
