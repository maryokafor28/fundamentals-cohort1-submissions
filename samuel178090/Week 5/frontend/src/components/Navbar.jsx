import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav style={{ 
      background: 'linear-gradient(135deg, #1e40af, #0891b2)',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ 
          fontSize: '1.8rem', 
          fontWeight: '700', 
          textDecoration: 'none', 
          color: 'white'
        }}>
          🏥 PulseTrack
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {/* Role-based Navigation */}
          {user?.role === 'admin' && (
            <>
              <Link to="/management" style={{ 
                textDecoration: 'none', 
                color: 'rgba(255,255,255,0.9)', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '6px'
              }}>🛠️ Management</Link>
              <Link to="/users" style={{ 
                textDecoration: 'none', 
                color: 'rgba(255,255,255,0.9)', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '6px'
              }}>👥 Patients</Link>
              <Link to="/doctors" style={{ 
                textDecoration: 'none', 
                color: 'rgba(255,255,255,0.9)', 
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '6px'
              }}>👨⚕️ Doctors</Link>
            </>
          )}
          
          <Link to="/activities" style={{ 
            textDecoration: 'none', 
            color: 'rgba(255,255,255,0.9)', 
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '6px'
          }}>🏃 Activities</Link>
          <Link to="/appointments" style={{ 
            textDecoration: 'none', 
            color: 'rgba(255,255,255,0.9)', 
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '6px'
          }}>📅 Appointments</Link>
          <Link to="/meals" style={{ 
            textDecoration: 'none', 
            color: 'rgba(255,255,255,0.9)', 
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '6px'
          }}>🍽️ Meals</Link>
          <Link to="/reports" style={{ 
            textDecoration: 'none', 
            color: 'rgba(255,255,255,0.9)', 
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '6px'
          }}>📊 Reports</Link>
          
          {user?.role === 'patient' && (
            <Link to="/doctors" style={{ 
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>👨⚕️ Find Doctors</Link>
          )}
          
          {(user?.role === 'patient' || user?.role === 'doctor') && (
            <Link to="/messages" style={{ 
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>💬 Messages</Link>
          )}
          
          {/* User Info and Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src={user?.profile?.profilePicture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
                alt={user?.profile?.name}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white' }}
              />
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500' }}>
                {user?.role === 'doctor' ? 'Dr. ' : ''}{user?.profile?.name}
              </span>
            </div>
            <button
              onClick={onLogout}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;