import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TaskList = ({ refreshTrigger, onTaskUpdated }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger, pagination.page]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks?page=${pagination.page}&limit=${pagination.limit}`);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await api.put(`/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        completed: !currentStatus
      });
      
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !currentStatus }
          : task
      ));
      onTaskUpdated();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      onTaskUpdated();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete task');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list">
      <h2>Tasks {user?.role === 'ADMIN' ? '(All Users)' : '(My Tasks)'}</h2>
      
      {error && <div className="error-message">{error}</div>}

      {tasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks found. Create your first task!</p>
        </div>
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-actions">
                    <button
                      className={`toggle-button ${task.completed ? 'complete' : 'incomplete'}`}
                      onClick={() => toggleTaskCompletion(task.id, task.completed)}
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.completed ? '✓' : '○'}
                    </button>
                    {user?.role === 'ADMIN' && (
                      <button
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-meta">
                  <span className="task-status">
                    Status: 
                    <span className={`status-badge ${task.completed ? 'completed' : 'pending'}`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </span>
                  {user?.role === 'ADMIN' && (
                    <span>Owner: {task.user.email}</span>
                  )}
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages} 
                ({pagination.total} total tasks)
              </span>
              
              <button
                className="pagination-button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;