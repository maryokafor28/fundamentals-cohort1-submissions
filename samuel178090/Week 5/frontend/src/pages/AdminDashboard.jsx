import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { userService } from '../services/userService';
import { doctorService } from '../services/doctorService';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignForm, setAssignForm] = useState({ patientId: '', doctorId: '' });

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
    fetchDoctors();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getAdminDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleAssignDoctor = async (e) => {
    e.preventDefault();
    try {
      await dashboardService.assignDoctorToPatient(assignForm);
      alert('Doctor assigned successfully!');
      setAssignForm({ patientId: '', doctorId: '' });
      fetchUsers();
    } catch (error) {
      alert('Error assigning doctor');
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c5aa0', marginBottom: '2rem' }}>🛡️ Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>👥 Total Patients</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{dashboardData?.stats?.totalUsers || 0}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>👨‍⚕️ Total Doctors</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4a90e2' }}>{dashboardData?.stats?.totalDoctors || 0}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>📅 Total Appointments</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>{dashboardData?.stats?.totalAppointments || 0}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>🏃 Total Activities</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{dashboardData?.stats?.totalActivities || 0}</p>
        </div>
      </div>

      {/* Assign Doctor Form */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Assign Doctor to Patient</h3>
        <form onSubmit={handleAssignDoctor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Select Patient:</label>
            <select
              value={assignForm.patientId}
              onChange={(e) => setAssignForm({...assignForm, patientId: e.target.value})}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
            >
              <option value="">Choose Patient</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Select Doctor:</label>
            <select
              value={assignForm.doctorId}
              onChange={(e) => setAssignForm({...assignForm, doctorId: e.target.value})}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
            >
              <option value="">Choose Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Assign
          </button>
        </form>
      </div>

      {/* Recent Users */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Recent Patients</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e1e8ed' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Age</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Assigned Doctor</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recentUsers?.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>{user.name}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{user.age}</td>
                  <td style={{ padding: '12px' }}>
                    {user.assignedDoctor ? 'Assigned' : 
                      <span style={{ color: '#e74c3c' }}>Not Assigned</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;