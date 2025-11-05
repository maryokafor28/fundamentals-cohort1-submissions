import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserProfile from './pages/UserProfile'
import Activities from './pages/Activities'
import CreateActivity from './pages/CreateActivity'
import Meals from './pages/Meals'
import CreateMeal from './pages/CreateMeal'
import Doctors from './pages/Doctors'
import CreateDoctor from './pages/CreateDoctor'
import Appointments from './pages/Appointments'
import CreateAppointment from './pages/CreateAppointment'
import Reports from './pages/Reports'
import CreateReport from './pages/CreateReport'
import NotFound from './pages/NotFound'

function App() {
  // Simple user state for demo purposes
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    name: 'Demo User',
    email: 'demo@pulsetrack.com',
    role: 'admin'
  })

  return (
    <div className="min-h-screen bg-neutral-50">
      <Layout currentUser={currentUser}>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          {/* Users */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserProfile />} />
          
          {/* Activities */}
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/new" element={<CreateActivity />} />
          
          {/* Meals */}
          <Route path="/meals" element={<Meals />} />
          <Route path="/meals/new" element={<CreateMeal />} />
          
          {/* Doctors */}
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/new" element={<CreateDoctor />} />
          
          {/* Appointments */}
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/new" element={<CreateAppointment />} />
          
          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/new" element={<CreateReport />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
