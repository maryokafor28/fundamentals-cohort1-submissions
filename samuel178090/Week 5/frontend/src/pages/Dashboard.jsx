import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#1e40af', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          🏥 PulseTrack Hospital Management
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Comprehensive Healthcare Management System</p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <div style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          padding: '1.5rem',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Users</h3>
          <p>Manage user profiles and health metrics</p>
          <Link to="/users" style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            View Users
          </Link>
        </div>

        <div style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          padding: '1.5rem',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Activities</h3>
          <p>Track fitness activities and calories burned</p>
          <Link to="/activities" style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            View Activities
          </Link>
        </div>

        <div style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          padding: '1.5rem',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Appointments</h3>
          <p>Schedule and manage medical appointments</p>
          <Link to="/appointments" style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#ffc107',
            color: 'black',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            View Appointments
          </Link>
        </div>

        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '1.5rem',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1e40af' }}>🍽️ Meals</h3>
          <p style={{ color: '#64748b' }}>Track patient nutrition and dietary plans</p>
          <Link to="/meals" style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            background: '#059669',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            Manage Meals
          </Link>
        </div>

        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '1.5rem',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1e40af' }}>📊 Reports</h3>
          <p style={{ color: '#64748b' }}>Generate and view medical reports</p>
          <Link to="/reports" style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            background: '#0891b2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            View Reports
          </Link>
        </div>

        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '1.5rem',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1e40af' }}>👨⚕️ Doctors</h3>
          <p style={{ color: '#64748b' }}>Manage healthcare providers</p>
          <Link to="/doctors" style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            background: '#7c3aed',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            View Doctors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;