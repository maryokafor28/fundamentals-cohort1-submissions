import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Activities from './pages/Activities';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminManagement from './pages/AdminManagement';
import DoctorDirectory from './pages/DoctorDirectory';
import Messages from './pages/Messages';
import Meals from './pages/Meals';
import Reports from './pages/Reports';
import { authService } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      authService.setToken(token);
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data.user);
    } catch (error) {
      authService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.removeToken();
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <div>
        <Register onRegister={handleRegister} />
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <button
            onClick={() => setShowRegister(false)}
            style={{
              padding: '10px 20px',
              background: 'white',
              border: '2px solid #2c5aa0',
              borderRadius: '8px',
              color: '#2c5aa0',
              cursor: 'pointer'
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    ) : (
      <div>
        <Login onLogin={handleLogin} />
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <button
            onClick={() => setShowRegister(true)}
            style={{
              padding: '10px 20px',
              background: 'white',
              border: '2px solid #27ae60',
              borderRadius: '8px',
              color: '#27ae60',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          {/* Role-based Dashboard Routes */}
          <Route path="/" element={
            user.role === 'admin' ? <AdminDashboard /> :
            user.role === 'doctor' ? <DoctorDashboard /> :
            <PatientDashboard />
          } />
          
          {/* Admin Only Routes */}
          {user.role === 'admin' && (
            <>
              <Route path="/management" element={<AdminManagement />} />
              <Route path="/users" element={<Users />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/reports" element={<Reports />} />
            </>
          )}
          
          {/* Doctor Routes */}
          {user.role === 'doctor' && (
            <>
              <Route path="/activities" element={<Activities />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/messages" element={<Messages currentUser={user} />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/reports" element={<Reports />} />
            </>
          )}
          
          {/* Patient Routes */}
          {user.role === 'patient' && (
            <>
              <Route path="/activities" element={<Activities />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/doctors" element={<DoctorDirectory currentUser={user} />} />
              <Route path="/messages" element={<Messages currentUser={user} />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/reports" element={<Reports />} />
            </>
          )}
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;