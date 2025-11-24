// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    setTasks([data.data, ...tasks]);
    setShowForm(false);
  };

  const handleUpdateTask = async (taskId, taskData) => {
    const { data } = await api.put(`/tasks/${taskId}`, taskData);
    setTasks(tasks.map(task => task._id === taskId ? data.data : task));
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTasks();
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/tasks/search', { search: searchQuery, page: 1, limit: 100 });
      setTasks(data.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);

    if (newFilter === 'all') {
      fetchTasks();
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/tasks/filter', { status: newFilter, page: 1, limit: 100 });
      setTasks(data.data);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return { total, pending, inProgress, completed };
  };

  const stats = getTaskStats();

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div className="welcome-text">
            <h1>Welcome back, {user?.username}! 👋</h1>
            <p>Here's what's happening with your tasks today</p>
          </div>
          {user?.role === 'admin' && (
            <div className="admin-badge-large">
              <span className="badge-icon">⭐</span>
              <span>Admin Access</span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="dashboard-controls">
          <div className="controls-header">
            <h2>📋 Your Tasks</h2>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <span>➕</span>
              New Task
            </button>
          </div>

          <div className="controls-actions">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>

            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>
              <button 
                className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => handleFilterChange('pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
                onClick={() => handleFilterChange('in-progress')}
              >
                In Progress
              </button>
              <button 
                className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onClose={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* Task List */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks yet!</h3>
            <p>Create your first task to get started on your productivity journey</p>
            <button className="btn btn-primary btn-lg" onClick={() => setShowForm(true)}>
              <span>✨</span>
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;