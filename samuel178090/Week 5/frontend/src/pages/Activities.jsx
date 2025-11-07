import { useState, useEffect } from 'react';
import { activityService } from '../services/activityService';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';

// Helper functions for activity images and emojis
const getActivityImage = (type) => {
  const activityImages = {
    running: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    walking: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    cycling: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    swimming: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
    yoga: 'https://images.unsplash.com/photo-1506629905607-d405b7a82d67?w=400&h=300&fit=crop',
    weightlifting: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    gym: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    cardio: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  };
  return activityImages[type.toLowerCase()] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
};

const getActivityEmoji = (type) => {
  const emojis = {
    running: '🏃',
    walking: '🚶',
    cycling: '🚴',
    swimming: '🏊',
    yoga: '🧘',
    weightlifting: '🏋️',
    gym: '💪',
    cardio: '❤️'
  };
  return emojis[type.toLowerCase()] || '🏃';
};

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    type: 'running',
    duration: '',
    caloriesBurned: '',
    notes: ''
  });

  useEffect(() => {
    fetchActivities();
    fetchUsers();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getAll();
      // Filter activities based on user role
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      let filteredActivities = response.data;
      
      if (currentUser.role === 'patient') {
        // Patients see only their own activities
        filteredActivities = response.data.filter(activity => 
          activity.user?._id === currentUser.profile?._id
        );
      } else if (currentUser.role === 'doctor') {
        // Doctors see only their patients' activities
        filteredActivities = response.data.filter(activity => 
          activity.user?.assignedDoctor === currentUser.profile?._id
        );
      }
      // Admin sees all activities
      
      setActivities(filteredActivities);
    } catch (err) {
      setError('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const activityData = {
        ...formData,
        user: currentUser.role === 'patient' ? currentUser.profile._id : formData.user
      };
      await activityService.create(activityData);
      setFormData({ user: '', type: 'running', duration: '', caloriesBurned: '', notes: '' });
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      setError('Failed to create activity');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.delete(id);
        fetchActivities();
      } catch (err) {
        setError('Failed to delete activity');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Activities</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'Add Activity'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ 
          border: '1px solid #dee2e6', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginBottom: '2rem',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Add New Activity</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {JSON.parse(localStorage.getItem('currentUser') || '{}').role !== 'patient' ? (
              <select
                value={formData.user}
                onChange={(e) => setFormData({...formData, user: e.target.value})}
                required
                style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="hidden"
                value={JSON.parse(localStorage.getItem('currentUser') || '{}').profile?._id || ''}
                onChange={(e) => setFormData({...formData, user: e.target.value})}
              />
            )}
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
            >
              <option value="running">Running</option>
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
              <option value="swimming">Swimming</option>
              <option value="gym">Gym</option>
              <option value="yoga">Yoga</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            <input
              type="number"
              placeholder="Calories Burned"
              value={formData.caloriesBurned}
              onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', gridColumn: '1 / -1' }}
            />
          </div>
          <button 
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Activity
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {activities.map(activity => (
          <div key={activity._id} style={{ 
            border: '1px solid #dee2e6', 
            padding: '1rem', 
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '1rem'
          }}>
            <img 
              src={activity.image || getActivityImage(activity.type)}
              alt={activity.type}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: '#2c5aa0', marginBottom: '0.5rem' }}>
                    {getActivityEmoji(activity.type)} {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </h3>
                  <p style={{ color: '#666', margin: '0.25rem 0' }}>👤 {activity.user?.name || 'Unknown'}</p>
                  <p style={{ color: '#666', margin: '0.25rem 0' }}>⏱️ {activity.duration} minutes | 🔥 {activity.caloriesBurned} calories</p>
                  <p style={{ color: '#666', margin: '0.25rem 0' }}>📅 {new Date(activity.date).toLocaleDateString()}</p>
                  {activity.assignedBy && (
                    <p style={{ color: '#27ae60', margin: '0.25rem 0', fontWeight: '600' }}>👨⚕️ Prescribed by Doctor</p>
                  )}
                  {activity.notes && (
                    <p style={{ color: '#888', fontSize: '14px', marginTop: '0.5rem', fontStyle: 'italic' }}>📝 {activity.notes}</p>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(activity._id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;