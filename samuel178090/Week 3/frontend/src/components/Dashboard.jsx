import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import SearchFilter from './SearchFilter';
import AdminPanel from './AdminPanel';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('tasks');
  };

  const handleTaskUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Task Management Dashboard</h1>
        <p>Welcome, {user?.email} ({user?.role})</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          My Tasks
        </button>
        <button 
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Task
        </button>
        <button 
          className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search & Filter
        </button>
        {user?.role === 'ADMIN' && (
          <button 
            className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Panel
          </button>
        )}
      </div>

      <div className="dashboard-content">
        {activeTab === 'tasks' && (
          <TaskList 
            refreshTrigger={refreshTrigger}
            onTaskUpdated={handleTaskUpdated}
          />
        )}
        {activeTab === 'create' && (
          <TaskForm onTaskCreated={handleTaskCreated} />
        )}
        {activeTab === 'search' && (
          <SearchFilter />
        )}
        {activeTab === 'admin' && user?.role === 'ADMIN' && (
          <AdminPanel />
        )}
      </div>
    </div>
  );
};

export default Dashboard;