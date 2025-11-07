import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-red-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-white">
              FlowServe Admin
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                  isActive('/admin/dashboard') || isActive('/admin')
                    ? 'bg-red-800 text-white' 
                    : 'text-white hover:bg-red-600'
                }`}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => navigate('/admin/users')}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                  isActive('/admin/users')
                    ? 'bg-red-800 text-white' 
                    : 'text-white hover:bg-red-600'
                }`}
              >
                Users
              </button>
              
              <button
                onClick={() => navigate('/admin/create-admin')}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                  isActive('/admin/create-admin')
                    ? 'bg-red-800 text-white' 
                    : 'text-white hover:bg-red-600'
                }`}
              >
                Create Admin
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-white text-sm">
              <span className="opacity-75">Admin:</span> {adminUser.name || adminUser.email}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-900 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;