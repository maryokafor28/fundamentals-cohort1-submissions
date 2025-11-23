
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, accessToken, isAdmin, logout, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [activeView, setActiveView] = useState('all');
  
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && accessToken) {
      fetchTasks();
    }
  }, [user, accessToken]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.getTasks(accessToken);
      setTasks(response.tasks);
      setActiveView('all');
      setPagination(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchTasks();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.searchTasks(accessToken, {
        keyword: searchKeyword,
        page: currentPage,
        limit: 10
      });
      setTasks(response.tasks);
      setPagination(response.pagination);
      setActiveView('search');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (selectedStatus) => {
    setFilterStatus(selectedStatus);
    
    if (!selectedStatus) {
      fetchTasks();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.filterTasks(accessToken, {
        status: selectedStatus,
        page: currentPage,
        limit: 10
      });
      setTasks(response.tasks);
      setPagination(response.pagination);
      setActiveView('filter');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    
    try {
      setLoading(true);
      let response;
      
      if (activeView === 'search') {
        response = await api.searchTasks(accessToken, {
          keyword: searchKeyword,
          page: newPage,
          limit: 10
        });
      } else if (activeView === 'filter') {
        response = await api.filterTasks(accessToken, {
          status: filterStatus,
          page: newPage,
          limit: 10
        });
      } else {
        return;
      }
      
      setTasks(response.tasks);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setFilterStatus('');
    setCurrentPage(1);
    fetchTasks();
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.createTask(accessToken, { title, description, status });
      setTitle('');
      setDescription('');
      setStatus('pending');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTask(accessToken, taskId, { status: newStatus });
      
      
      if (activeView === 'search') {
        handleSearch({ preventDefault: () => {} });
      } else if (activeView === 'filter') {
        handleFilter(filterStatus);
      } else {
        fetchTasks();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.deleteTask(accessToken, taskId);
      
      
      if (activeView === 'search') {
        handleSearch({ preventDefault: () => {} });
      } else if (activeView === 'filter') {
        handleFilter(filterStatus);
      } else {
        fetchTasks();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (authLoading || !user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Task Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back, {user.email} 
            {isAdmin && <span className={styles.badge}>Admin</span>}
          </p>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      <div className={styles.searchFilterSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search tasks by keyword..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            🔍 Search
          </button>
        </form>

        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => handleFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {(activeView !== 'all') && (
          <button onClick={clearFilters} className={styles.clearButton}>
            ✖ Clear Filters
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.createButton}
        >
          {showForm ? 'Cancel' : '+ Create Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateTask} className={styles.form}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className={styles.input}
            required
            maxLength={100}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className={styles.textarea}
            required
            maxLength={500}
            rows={4}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.select}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className={styles.submitButton}>
            Create Task
          </button>
        </form>
      )}

      <div className={styles.taskList}>
        {loading ? (
          <p className={styles.loading}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className={styles.empty}>
            {activeView !== 'all' 
              ? 'No tasks found matching your search/filter criteria.' 
              : 'No tasks yet. Create your first task!'}
          </p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={styles.taskCard}>
              <div className={styles.taskHeader}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className={`${styles.statusSelect} ${styles[task.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <p className={styles.taskDescription}>{task.description}</p>
              
              {isAdmin && task.userId && (
                <div className={styles.creatorInfo}>
                  <span className={styles.creatorLabel}>Created by:</span>
                  <span className={styles.creatorEmail}>{task.userId.email}</span>
                  {task.userId.role === 'admin' && (
                    <span className={styles.creatorBadge}>Admin</span>
                  )}
                </div>
              )}
              
              <div className={styles.taskFooter}>
                <span className={styles.taskDate}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            ← Previous
          </button>
          
          <span className={styles.pageInfo}>
            Page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalItems} total)
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className={styles.pageButton}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
