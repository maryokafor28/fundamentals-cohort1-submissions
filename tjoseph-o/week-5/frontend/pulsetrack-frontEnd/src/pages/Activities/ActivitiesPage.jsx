import { useState, useEffect } from 'react';
import ActivityList from '../../components/Activity/ActivityList';
import ActivityForm from '../../components/Activity/ActivityForm';
import * as activityService from '../../services/activityService';
import * as userService from '../../services/userService';
import './ActivitiesPage.css';

const ActivitiesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddActivity = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (activityData) => {
    try {
      await activityService.createActivity(activityData);
      setShowForm(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      alert('Failed to create activity: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loadingUsers) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="activities-page">
      {showForm ? (
        <div className="form-container">
          <h2>Add New Activity</h2>
          <ActivityForm onSubmit={handleSubmit} onCancel={handleCancel} users={users} />
        </div>
      ) : (
        <ActivityList key={refreshKey} onAddActivity={handleAddActivity} />
      )}
    </div>
  );
};

export default ActivitiesPage;