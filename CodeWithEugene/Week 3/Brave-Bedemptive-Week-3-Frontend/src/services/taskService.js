import api from './api'

export const taskService = {
  // Get all tasks with pagination and filtering
  async getTasks(params = {}) {
    try {
      const response = await api.get('/tasks', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get a specific task
  async getTask(id) {
    try {
      const response = await api.get(`/tasks/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Create a new task
  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update a task
  async updateTask(id, taskData) {
    try {
      const response = await api.put(`/tasks/${id}`, taskData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete a task (Admin only)
  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Search tasks
  async searchTasks(searchData) {
    try {
      const response = await api.post('/tasks/search', searchData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Filter tasks
  async filterTasks(filterData, params = {}) {
    try {
      const response = await api.post('/tasks/filter', filterData, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get task statistics
  async getTaskStats() {
    try {
      const response = await api.get('/tasks/stats/overview')
      return response.data
    } catch (error) {
      throw error
    }
  }
}
