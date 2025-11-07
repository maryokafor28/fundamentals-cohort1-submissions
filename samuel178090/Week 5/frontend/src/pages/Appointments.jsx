import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { userService } from '../services/userService';
import { doctorService } from '../services/doctorService';
import LoadingSpinner from '../components/LoadingSpinner';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAll();
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAll();
      setDoctors(response.data);
    } catch (err) {
      console.error('Failed to fetch doctors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create(formData);
      setFormData({ user: '', doctor: '', date: '', time: '', reason: '', notes: '' });
      setShowForm(false);
      fetchAppointments();
    } catch (err) {
      setError('Failed to create appointment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.delete(id);
        fetchAppointments();
      } catch (err) {
        setError('Failed to delete appointment');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Appointments</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'Schedule Appointment'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ 
          border: '1px solid #dee2e6', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginBottom: '2rem',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Schedule New Appointment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <select
              value={formData.user}
              onChange={(e) => setFormData({...formData, user: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Reason for visit"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              required
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', gridColumn: '1 / -1' }}
            />
            <input
              type="text"
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', gridColumn: '1 / -1' }}
            />
          </div>
          <button 
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Schedule Appointment
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {appointments.map(appointment => (
          <div key={appointment._id} style={{ 
            border: '1px solid #dee2e6', 
            padding: '1rem', 
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{appointment.reason}</h3>
                <p>Patient: {appointment.user?.name || 'Unknown'}</p>
                <p>Doctor: {appointment.doctor?.name || 'Unknown'} ({appointment.doctor?.specialization})</p>
                <p>Date: {new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                <p>Status: <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px',
                  backgroundColor: appointment.status === 'scheduled' ? '#d4edda' : 
                                 appointment.status === 'completed' ? '#cce5ff' : '#f8d7da',
                  color: appointment.status === 'scheduled' ? '#155724' : 
                         appointment.status === 'completed' ? '#004085' : '#721c24'
                }}>{appointment.status}</span></p>
                {appointment.notes && <p>Notes: {appointment.notes}</p>}
              </div>
              <button 
                onClick={() => handleDelete(appointment._id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;