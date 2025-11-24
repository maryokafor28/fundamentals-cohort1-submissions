import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './pages/Users';
import Activities from './pages/Activities';
import Appointments from './pages/Appointments';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
              <h2>🏥 PulseTrack</h2>
            </Link>

            <button 
              className="mobile-menu-toggle" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

            <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              <li>
                <Link to="/" onClick={closeMobileMenu}>Users</Link>
              </li>
              <li>
                <Link to="/activities" onClick={closeMobileMenu}>Activities</Link>
              </li>
              <li>
                <Link to="/appointments" onClick={closeMobileMenu}>Appointments</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 PulseTrack - Health Monitoring System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;