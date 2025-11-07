import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    LastName: '',
    email: '',
    phone: '',
    username: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      if (userId) {
        // Viewing another user's profile - mock data for now
        const mockUser = {
          UID: userId,
          firstName: 'John',
          LastName: 'Doe',
          username: 'johndoe',
          email: 'j***@example.com',
          phone: '012****7890',
          createdAt: new Date().toISOString(),
          isActive: true
        };
        setUser(mockUser);
        setIsOwnProfile(false);
      } else {
        // Viewing own profile
        const response = await apiService.getCurrentUser();
        if (response && response.user) {
          setUser(response.user);
          setIsOwnProfile(true);
          setFormData({
            firstName: response.user.firstName || '',
            LastName: response.user.LastName || '',
            email: response.user.email || '',
            phone: response.user.phone || '',
            username: response.user.username || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Mock API call - in real app would call updateProfile API
      setUser({ ...user, ...formData });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      LastName: user.LastName || '',
      email: user.email || '',
      phone: user.phone || '',
      username: user.username || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load user profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {userId && (
              <button
                onClick={() => navigate('/users')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Users
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isOwnProfile ? 'My Profile' : 'User Profile'}
              </h1>
              <p className="text-gray-600">
                {isOwnProfile ? 'Manage your account information' : 'View user information'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user.firstName?.charAt(0)}{user.LastName?.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {user.firstName} {user.LastName}
                </h3>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  {isOwnProfile && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Balance</span>
                      <span className="font-semibold text-green-600">
                        ₦{user.balance?.toLocaleString() || '0.00'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                  {isOwnProfile && (
                    !editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={handleSave}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {editing && isOwnProfile ? (
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {editing && isOwnProfile ? (
                        <input
                          type="text"
                          value={formData.LastName}
                          onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.LastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      {editing && isOwnProfile ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <p className="py-2 text-gray-900">{user.phone}</p>
                      <p className="text-xs text-gray-500">Phone number cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      {editing && isOwnProfile ? (
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">@{user.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User ID
                      </label>
                      <p className="py-2 text-gray-500 font-mono text-sm">{user.UID}</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Security Section - Only for own profile */}
            {isOwnProfile && (
              <div className="bg-white rounded-lg shadow-md mt-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Security</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-500">Update your account password</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Not Enabled
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Send Money Section - Only for other users */}
            {!isOwnProfile && (
              <div className="bg-white rounded-lg shadow-md mt-6">
                <div className="p-6">
                  <button
                    onClick={() => navigate('/transactions', { 
                      state: { recipientPhone: user.phone } 
                    })}
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold"
                  >
                    💸 Send Money to {user.firstName}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;