import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SearchFilter = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await api.post('/tasks/search', {
        query: searchQuery,
        page: 1,
        limit: 20
      });
      setResults(response.data.tasks);
    } catch (error) {
      setError(error.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    
    if (filterStatus === '') {
      setError('Please select a filter option');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await api.post('/tasks/filter', {
        completed: filterStatus === 'completed',
        page: 1,
        limit: 20
      });
      setResults(response.data.tasks);
    } catch (error) {
      setError(error.response?.data?.error || 'Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setSearchQuery('');
    setFilterStatus('');
    setHasSearched(false);
    setError('');
  };

  return (
    <div className="search-filter">
      <h2>Search & Filter Tasks</h2>
      
      <div className="search-filter-controls">
        <div className="search-section">
          <h3>Search Tasks</h3>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description..."
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="search-button">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        <div className="filter-section">
          <h3>Filter by Status</h3>
          <form onSubmit={handleFilter} className="filter-form">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              disabled={loading}
            >
              <option value="">Select status...</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <button type="submit" disabled={loading} className="filter-button">
              {loading ? 'Filtering...' : 'Filter'}
            </button>
          </form>
        </div>

        {hasSearched && (
          <button onClick={clearResults} className="clear-button">
            Clear Results
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {hasSearched && (
        <div className="search-results">
          <h3>Results ({results.length} found)</h3>
          
          {results.length === 0 ? (
            <div className="no-results">
              <p>No tasks found matching your criteria.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {results.map(task => (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <div className="task-header">
                    <h4>{task.title}</h4>
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
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;