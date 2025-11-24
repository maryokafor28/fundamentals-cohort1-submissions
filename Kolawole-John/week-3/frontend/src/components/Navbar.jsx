// frontend/src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">🔒</div>
          <div className="brand-text">
            <h1>SecureTask</h1>
            <span className="brand-subtitle">Task Management System</span>
          </div>
        </div>

        <div className="navbar-user">
          <div className="user-avatar">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">
              {user?.role === 'admin' ? (
                <span className="role-badge role-admin">
                  <span>⭐</span>
                  Admin
                </span>
              ) : (
                <span className="role-badge role-user">
                  <span>👤</span>
                  User
                </span>
              )}
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;