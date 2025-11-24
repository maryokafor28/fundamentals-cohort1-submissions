import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'male',
    height: '',
    weight: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userAPI.create(formData);
      setShowForm(false);
      setFormData({ name: '', email: '', age: '', gender: 'male', height: '', weight: '' });
      fetchUsers();
      alert('✅ User created successfully!');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Failed to create user'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        fetchUsers();
        alert('✅ User deleted successfully!');
      } catch (err) {
        alert('❌ ' + (err.response?.data?.message || 'Failed to delete user'));
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>❌ Error: {error}</p>
          <button onClick={fetchUsers} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>👥 Users Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ Add New User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleInputChange}
                min="1"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select 
                id="gender"
                name="gender" 
                value={formData.gender} 
                onChange={handleInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                placeholder="Enter height in cm"
                value={formData.height}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                placeholder="Enter weight in kg"
                value={formData.weight}
                onChange={handleInputChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-success">✓ Create User</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users found. Create one to get started!</p>
        </div>
      ) : (
        <div className="items-list">
          {users.map(user => (
            <div key={user._id} className="card">
              <div className="card-header">
                <h3 className="card-title">{user.name}</h3>
                <span className="badge badge-primary">{user.gender}</span>
              </div>
              <div className="card-body">
                <div className="card-info">
                  <strong>Email:</strong> {user.email}
                </div>
                {user.age && (
                  <div className="card-info">
                    <strong>Age:</strong> {user.age} years
                  </div>
                )}
                {user.height && user.weight && (
                  <div className="card-info">
                    <strong>Stats:</strong> {user.height}cm / {user.weight}kg
                  </div>
                )}
              </div>
              <div className="card-actions">
                <button onClick={() => handleDelete(user._id)} className="btn-danger btn-sm">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;