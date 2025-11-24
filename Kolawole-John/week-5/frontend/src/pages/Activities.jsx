import { useState, useEffect } from 'react';
import { activityAPI, userAPI } from '../services/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    activityType: 'running',
    duration: '',
    distance: '',
    caloriesBurned: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchActivities();
    fetchUsers();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getAll();
      setActivities(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await activityAPI.create(formData);
      setShowForm(false);
      setFormData({
        user: '',
        activityType: 'running',
        duration: '',
        distance: '',
        caloriesBurned: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
      await fetchActivities();
      alert('✅ Activity logged successfully!');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Failed to create activity'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      await activityAPI.delete(id);
      await fetchActivities();
      alert('✅ Activity deleted');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Failed to delete activity'));
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner" />
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>❌ Error: {error}</p>
          <button onClick={fetchActivities} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>🏃 Activities</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ Add Activity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="user">User *</label>
              <select id="user" name="user" value={formData.user} onChange={handleInputChange} required>
                <option value="">-- Select user --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="activityType">Activity Type</label>
              <select id="activityType" name="activityType" value={formData.activityType} onChange={handleInputChange}>
                <option value="running">Running</option>
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
                <option value="swimming">Swimming</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} min="0" />
            </div>

            <div className="form-group">
              <label htmlFor="distance">Distance (km)</label>
              <input type="number" id="distance" name="distance" value={formData.distance} onChange={handleInputChange} step="0.01" min="0" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="caloriesBurned">Calories</label>
              <input type="number" id="caloriesBurned" name="caloriesBurned" value={formData.caloriesBurned} onChange={handleInputChange} min="0" />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-success">✓ Log Activity</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {activities.length === 0 ? (
        <div className="empty-state">
          <p>No activities found.</p>
        </div>
      ) : (
        <div className="items-list">
          {activities.map(act => (
            <div key={act._id} className="card">
              <div className="card-header">
                <h3 className="card-title">{act.activityType} — {act.duration ? `${act.duration} min` : '—'}</h3>
                <span className="badge">{new Date(act.date).toLocaleDateString()}</span>
              </div>
              <div className="card-body">
                <div className="card-info"><strong>User:</strong> {act.user?.name || act.user}</div>
                {act.distance && <div className="card-info"><strong>Distance:</strong> {act.distance} km</div>}
                {act.caloriesBurned && <div className="card-info"><strong>Calories:</strong> {act.caloriesBurned}</div>}
                {act.notes && <div className="card-info"><strong>Notes:</strong> {act.notes}</div>}
              </div>
              <div className="card-actions">
                <button onClick={() => handleDelete(act._id)} className="btn-danger btn-sm">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Activities;
