import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { user, updateProfile, logout, logoutAll } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await updateProfile(data)
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout()
    }
  }

  const handleLogoutAll = async () => {
    if (window.confirm('Are you sure you want to logout from all devices? This will invalidate all your active sessions.')) {
      await logoutAll()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline btn-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters long',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores',
                  },
                })}
                type="text"
                className="input"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                type="email"
                className="input"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-md"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline btn-md"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Username</p>
                <p className="text-gray-900">{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email Address</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Role</p>
                <p className="text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Member Since</p>
                <p className="text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            <span>Logout from this device</span>
          </button>
          
          <button
            onClick={handleLogoutAll}
            className="flex items-center space-x-3 w-full p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span>Logout from all devices</span>
          </button>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Information</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            • Your password is securely hashed using bcrypt with 12 rounds
          </p>
          <p>
            • Access tokens are stored in memory and expire after 15 minutes
          </p>
          <p>
            • Refresh tokens are stored in secure HttpOnly cookies
          </p>
          <p>
            • Failed login attempts are tracked and accounts are locked after 3 attempts
          </p>
          <p>
            • All API communications are protected with HTTPS in production
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile
