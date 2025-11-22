import { useState } from 'react';
import UserList from '../../components/User/UserList';
import UserForm from '../../components/User/UserForm';
import * as userService from '../../services/userService';
import './UsersPage.css';

const UsersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddUser = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (userData) => {
    try {
      await userService.createUser(userData);
      setShowForm(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      alert('Failed to create user: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="users-page">
      {showForm ? (
        <div className="form-container">
          <h2>Add New User</h2>
          <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      ) : (
        <UserList key={refreshKey} onAddUser={handleAddUser} />
      )}
    </div>
  );
};

export default UsersPage;