import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Calendar, Clock, Flame } from 'lucide-react'
import { activityApi, userApi } from '../lib/api'
import { getActivityIcon } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CreateActivity() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      activityDate: new Date().toISOString().split('T')[0],
      duration: '',
      intensity: 'moderate',
      type: 'running'
    }
  })

  const selectedType = watch('type')

  // Fetch users for selection
  const { data: users } = useQuery('users-select', () => 
    userApi.getAll({ limit: 100 })
  )

  // Fetch activity types
  const { data: activityTypes } = useQuery('activity-types', activityApi.getTypes)

  const createActivityMutation = useMutation(activityApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('activities')
      toast.success('Activity logged successfully!')
      navigate('/activities')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create activity')
    }
  })

  const onSubmit = (data) => {
    const activityData = {
      ...data,
      duration: parseInt(data.duration),
      caloriesBurned: data.caloriesBurned ? parseInt(data.caloriesBurned) : 0,
      distance: data.distanceValue ? {
        value: parseFloat(data.distanceValue),
        unit: data.distanceUnit || 'km'
      } : undefined,
      heartRate: data.avgHeartRate ? {
        average: parseInt(data.avgHeartRate),
        max: data.maxHeartRate ? parseInt(data.maxHeartRate) : undefined
      } : undefined,
      location: data.locationName ? {
        name: data.locationName
      } : undefined
    }

    // Remove undefined fields
    Object.keys(activityData).forEach(key => {
      if (activityData[key] === undefined || activityData[key] === '') {
        delete activityData[key]
      }
    })

    createActivityMutation.mutate(activityData)
  }

  const intensityOptions = [
    { value: 'low', label: 'Low', description: 'Light effort, can sing' },
    { value: 'moderate', label: 'Moderate', description: 'Some effort, can talk' },
    { value: 'high', label: 'High', description: 'Hard effort, difficult to talk' },
    { value: 'very_high', label: 'Very High', description: 'Maximum effort' }
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/activities')}
          className="btn-ghost p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Log New Activity</h1>
          <p className="text-neutral-600 mt-1">
            Record your fitness activity or workout session
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
              <label className="form-label">Activity Type *</label>
              <select 
                {...register('type', { required: 'Activity type is required' })}
                className={`select ${errors.type ? 'input-error' : ''}`}
              >
                {activityTypes?.data?.map((type) => (
                  <option key={type} value={type}>
                    {getActivityIcon(type)} {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.type && <p className="form-error">{errors.type.message}</p>}
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Activity Title *</label>
              <input
                type="text"
                placeholder="e.g., Morning Run in Central Park"
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                })}
                className={`input ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Activity Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                {...register('activityDate', { required: 'Date is required' })}
                className={`input ${errors.activityDate ? 'input-error' : ''}`}
              />
              {errors.activityDate && <p className="form-error">{errors.activityDate.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration (minutes) *
              </label>
              <input
                type="number"
                min="1"
                placeholder="30"
                {...register('duration', { 
                  required: 'Duration is required',
                  min: { value: 1, message: 'Duration must be at least 1 minute' }
                })}
                className={`input ${errors.duration ? 'input-error' : ''}`}
              />
              {errors.duration && <p className="form-error">{errors.duration.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Flame className="w-4 h-4 inline mr-1" />
                Calories Burned
              </label>
              <input
                type="number"
                min="0"
                placeholder="250"
                {...register('caloriesBurned')}
                className="input"
              />
              <p className="form-help">Optional - estimated calories burned</p>
            </div>

            <div className="form-group">
              <label className="form-label">Intensity *</label>
              <select 
                {...register('intensity', { required: 'Intensity is required' })}
                className={`select ${errors.intensity ? 'input-error' : ''}`}
              >
                {intensityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
              {errors.intensity && <p className="form-error">{errors.intensity.message}</p>}
            </div>
          </div>
        </div>

        {/* Optional Details */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Optional Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Distance</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="5.2"
                  {...register('distanceValue')}
                  className="input"
                />
                <select {...register('distanceUnit')} className="select">
                  <option value="km">Kilometers</option>
                  <option value="miles">Miles</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                placeholder="Central Park, NYC"
                {...register('locationName')}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Average Heart Rate (bpm)</label>
              <input
                type="number"
                min="40"
                max="220"
                placeholder="145"
                {...register('avgHeartRate')}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Heart Rate (bpm)</label>
              <input
                type="number"
                min="40"
                max="220"
                placeholder="165"
                {...register('maxHeartRate')}
                className="input"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                rows={3}
                placeholder="How did the activity go? Any notes about performance, weather, etc."
                {...register('description', {
                  maxLength: { value: 500, message: 'Description must be less than 500 characters' }
                })}
                className={`textarea ${errors.description ? 'input-error' : ''}`}
              />
              {errors.description && <p className="form-error">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/activities')}
            className="btn-outline"
            disabled={createActivityMutation.isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createActivityMutation.isLoading}
            className="btn-primary"
          >
            {createActivityMutation.isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Log Activity
          </button>
        </div>
      </form>
    </div>
  )
}
