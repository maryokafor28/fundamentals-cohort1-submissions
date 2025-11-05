import { useState } from 'react'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  Tag,
  User,
  CheckSquare
} from 'lucide-react'
import { formatDate, getStatusColor, getPriorityColor, isOverdue, isDueSoon } from '../utils/helpers'
import LoadingSpinner from '../components/LoadingSpinner'
import TaskModal from '../components/TaskModal'

const Tasks = () => {
  const { isAdmin } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const { data: tasksData, isLoading } = useTasks({
    page: currentPage,
    limit: 10,
    search: searchTerm,
    status: statusFilter,
    priority: priorityFilter,
  })

  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const handleCreateTask = async (taskData) => {
    await createTaskMutation.mutateAsync(taskData)
    setShowCreateModal(false)
  }

  const handleUpdateTask = async (taskData) => {
    await updateTaskMutation.mutateAsync({
      id: editingTask._id,
      data: taskData,
    })
    setEditingTask(null)
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTaskMutation.mutateAsync(taskId)
    }
  }

  const tasks = tasksData?.data || []
  const pagination = tasksData?.pagination || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your tasks and track progress</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('')
              setPriorityFilter('')
            }}
            className="btn btn-outline btn-md"
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter || priorityFilter
                ? 'Try adjusting your filters to see more tasks.'
                : 'Get started by creating your first task.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary btn-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <span className={`badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {isOverdue(task.dueDate, task.status) && (
                        <span className="badge bg-red-100 text-red-800 border-red-200">
                          Overdue
                        </span>
                      )}
                      {isDueSoon(task.dueDate, task.status) && (
                        <span className="badge bg-yellow-100 text-yellow-800 border-yellow-200">
                          Due Soon
                        </span>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 mb-3">{task.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due {formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{task.tags.join(', ')}</span>
                        </div>
                      )}
                      
                      {task.assignedTo && (
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Assigned to {task.assignedTo.username}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    {isAdmin() && (
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalTasks)} of {pagination.totalTasks} tasks
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <TaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
          title="Create New Task"
        />
      )}
      
      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          title="Edit Task"
          initialData={editingTask}
        />
      )}
    </div>
  )
}

export default Tasks
