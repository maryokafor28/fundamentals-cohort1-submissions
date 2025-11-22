import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UsersPage from './pages/Users/UsersPage';
import ActivitiesPage from './pages/Activities/ActivitiesPage';
import AppointmentsPage from './pages/Appointments/AppointmentsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="logo">PulseTrack</h1>
            <ul className="nav-links">
              <li><Link to="/">Users</Link></li>
              <li><Link to="/activities">Activities</Link></li>
              <li><Link to="/appointments">Appointments</Link></li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<UsersPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;