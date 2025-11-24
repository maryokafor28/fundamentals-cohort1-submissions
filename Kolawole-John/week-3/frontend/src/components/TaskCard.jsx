// frontend/src/components/TaskCard.jsx
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'status-pending',
      'in-progress': 'status-progress',
      'completed': 'status-completed'
    };
    return colors[status] || '';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high'
    };
    return colors[priority] || '';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'in-progress': '🔄',
      'completed': '✅'
    };
    return icons[status] || '📋';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🔴'
    };
    return icons[priority] || '⚪';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '🔴 Overdue';
    if (diffDays === 0) return '🟡 Due today';
    if (diffDays === 1) return '🟢 Due tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`task-card ${getStatusColor(task.status)}`}>
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`badge ${getStatusColor(task.status)}`}>
            <span className="badge-icon">{getStatusIcon(task.status)}</span>
            {task.status.replace('-', ' ')}
          </span>
          <span className={`badge ${getPriorityColor(task.priority)}`}>
            <span className="badge-icon">{getPriorityIcon(task.priority)}</span>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="task-card-body">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">
          {task.description || 'No description provided'}
        </p>
      </div>

      <div className="task-card-footer">
        <div className="task-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span className="meta-text">{formatDate(task.dueDate)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">👤</span>
            <span className="meta-text">{task.createdBy?.username || 'Unknown'}</span>
          </div>
        </div>

        <div className="task-actions">
          <button 
            className="task-action-btn btn-edit"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <span>✏️</span>
          </button>
          
          {isAdmin && (
            <button 
              className="task-action-btn btn-delete"
              onClick={() => onDelete(task._id)}
              title="Delete task (Admin only)"
            >
              <span>🗑️</span>
            </button>
          )}
        </div>
      </div>

      {task.status === 'completed' && (
        <div className="task-completed-overlay">
          <div className="completed-badge">✓</div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;