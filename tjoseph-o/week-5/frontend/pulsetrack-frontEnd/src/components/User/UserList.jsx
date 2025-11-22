import { useState, useEffect } from 'react';
import * as userService from '../../services/userService';
import './UserList.css';

const UserList = ({ onAddUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        alert('Failed to delete user: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (users.length === 0) {
    return (
      <div className="user-list">
        <div className="header">
          <h2>Users</h2>
          <button className="btn-primary" onClick={onAddUser}>Add User</button>
        </div>
        <div className="empty-state">No users found</div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="header">
        <h2>Users</h2>
        <button className="btn-primary" onClick={onAddUser}>Add User</button>
      </div>
      
      <div className="user-grid">
        {users.map(user => (
          <div key={user._id} className="user-card">
            <h3>{user.name}</h3>
            <p className="email">{user.email}</p>
            {user.age && <p>Age: {user.age}</p>}
            {user.gender && <p>Gender: {user.gender}</p>}
            <div className="card-actions">
              <button className="btn-secondary">Edit</button>
              <button 
                className="btn-danger" 
                onClick={() => handleDelete(user._id)}
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

export default UserList;