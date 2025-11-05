import { useQuery, useMutation, useQueryClient } from 'react-query'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'

// Custom hook for fetching tasks
export const useTasks = (params = {}) => {
  return useQuery(
    ['tasks', params],
    () => taskService.getTasks(params),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
    }
  )
}

// Custom hook for fetching a single task
export const useTask = (id) => {
  return useQuery(
    ['task', id],
    () => taskService.getTask(id),
    {
      enabled: !!id,
    }
  )
}

// Custom hook for creating a task
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (taskData) => taskService.createTask(taskData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks')
        toast.success('Task created successfully!')
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.error || 'Failed to create task'
        toast.error(errorMessage)
      },
    }
  )
}

// Custom hook for updating a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ id, data }) => taskService.updateTask(id, data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries('tasks')
        queryClient.invalidateQueries(['task', variables.id])
        toast.success('Task updated successfully!')
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.error || 'Failed to update task'
        toast.error(errorMessage)
      },
    }
  )
}

// Custom hook for deleting a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (id) => taskService.deleteTask(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks')
        toast.success('Task deleted successfully!')
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.error || 'Failed to delete task'
        toast.error(errorMessage)
      },
    }
  )
}

// Custom hook for searching tasks
export const useSearchTasks = () => {
  return useMutation(
    (searchData) => taskService.searchTasks(searchData),
    {
      onError: (error) => {
        const errorMessage = error.response?.data?.error || 'Search failed'
        toast.error(errorMessage)
      },
    }
  )
}

// Custom hook for filtering tasks
export const useFilterTasks = () => {
  return useMutation(
    ({ filterData, params }) => taskService.filterTasks(filterData, params),
    {
      onError: (error) => {
        const errorMessage = error.response?.data?.error || 'Filter failed'
        toast.error(errorMessage)
      },
    }
  )
}

// Custom hook for task statistics
export const useTaskStats = () => {
  return useQuery(
    'taskStats',
    () => taskService.getTaskStats(),
    {
      staleTime: 60000, // 1 minute
    }
  )
}
