import { useTaskStats } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { 
  Shield, 
  Users, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminPanel = () => {
  const { user } = useAuth()
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
              Error loading admin panel
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.message}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const adminStats = [
    {
      name: 'Total Tasks',
      value: stats?.data?.totalTasks || 0,
      icon: CheckSquare,
      color: 'bg-blue-500',
      description: 'All tasks in the system'
    },
    {
      name: 'Overdue Tasks',
      value: stats?.data?.overdueTasks || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      description: 'Tasks past their due date'
    },
    {
      name: 'Completed Tasks',
      value: stats?.data?.statusBreakdown?.completed || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'Successfully completed tasks'
    },
    {
      name: 'In Progress',
      value: stats?.data?.statusBreakdown?.['in-progress'] || 0,
      icon: BarChart3,
      color: 'bg-yellow-500',
      description: 'Tasks currently being worked on'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">
              Welcome, {user?.username}. Manage the entire task management system.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => {
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
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </div>
          )
        })}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h2>
          <div className="space-y-3">
            {Object.entries(stats?.data?.statusBreakdown || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'completed' ? 'bg-green-500' :
                    status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <span className="font-medium text-gray-900 capitalize">
                    {status.replace('-', ' ')}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h2>
          <div className="space-y-3">
            {Object.entries(stats?.data?.priorityBreakdown || {}).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    priority === 'high' ? 'bg-red-500' :
                    priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="font-medium text-gray-900 capitalize">{priority}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/tasks"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckSquare className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <span className="font-medium text-gray-900">Manage All Tasks</span>
              <p className="text-sm text-gray-600">View and manage all tasks in the system</p>
            </div>
          </a>
          
          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <Users className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <span className="font-medium text-gray-500">User Management</span>
              <p className="text-sm text-gray-500">Coming soon - Manage users and roles</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <BarChart3 className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <span className="font-medium text-gray-500">Advanced Analytics</span>
              <p className="text-sm text-gray-500">Coming soon - Detailed system analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Authentication</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>JWT tokens with secure rotation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Account lockout protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Password hashing with bcrypt</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Authorization</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Role-based access control</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Input validation and sanitization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Rate limiting protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
