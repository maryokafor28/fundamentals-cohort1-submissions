import { useState, useEffect } from 'react';
import * as activityService from '../../services/activityService';
import './ActivityList.css';

const ActivityList = ({ onAddActivity, userId = null }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityService.getActivities(userId);
      setActivities(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.deleteActivity(id);
        setActivities(activities.filter(activity => activity._id !== id));
      } catch (err) {
        alert('Failed to delete activity: ' + err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    const icons = {
      running: '🏃',
      walking: '🚶',
      cycling: '🚴',
      swimming: '🏊',
      gym: '🏋️',
      yoga: '🧘',
      other: '💪'
    };
    return icons[type] || '💪';
  };

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (activities.length === 0) {
    return (
      <div className="activity-list">
        <div className="header">
          <h2>Activities</h2>
          <button className="btn-primary" onClick={onAddActivity}>Add Activity</button>
        </div>
        <div className="empty-state">No activities found</div>
      </div>
    );
  }

  return (
    <div className="activity-list">
      <div className="header">
        <h2>Activities</h2>
        <button className="btn-primary" onClick={onAddActivity}>Add Activity</button>
      </div>
      
      <div className="activity-grid">
        {activities.map(activity => (
          <div key={activity._id} className="activity-card">
            <div className="activity-header">
              <span className="activity-icon">{getActivityIcon(activity.activityType)}</span>
              <h3>{activity.activityType}</h3>
            </div>
            
            <div className="activity-details">
              <p><strong>Duration:</strong> {activity.duration} minutes</p>
              {activity.distance && <p><strong>Distance:</strong> {activity.distance} km</p>}
              {activity.caloriesBurned && <p><strong>Calories:</strong> {activity.caloriesBurned} cal</p>}
              <p className="date">{formatDate(activity.date)}</p>
              {activity.notes && <p className="notes">{activity.notes}</p>}
              {activity.userId && (
                <p className="user-info">By: {activity.userId.name}</p>
              )}
            </div>

            <div className="card-actions">
              <button 
                className="btn-danger" 
                onClick={() => handleDelete(activity._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;