import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { messageService } from '../services/messageService';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';

const PatientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    fetchDashboardData();
    fetchMessages();
    fetchDoctors();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getPatientDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await messageService.getMessages();
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
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

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create(appointmentForm);
      alert('Appointment booked successfully!');
      setShowBooking(false);
      setAppointmentForm({ doctor: '', date: '', time: '', reason: '' });
      fetchDashboardData();
    } catch (error) {
      alert('Error booking appointment');
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await messageService.markAsRead(messageId);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c5aa0', marginBottom: '2rem' }}>👤 Patient Dashboard</h1>

      {/* Stats Cards */}
      <div className="animate-fadeIn" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stagger-item hover-lift" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>🏃 My Activities</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{dashboardData?.stats?.totalActivities || 0}</p>
        </div>
        <div className="stagger-item hover-lift" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>📅 Upcoming Appointments</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>{dashboardData?.stats?.upcomingAppointments || 0}</p>
        </div>
        <div className="stagger-item hover-lift" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>💬 New Messages</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{dashboardData?.stats?.unreadMessagesCount || 0}</p>
        </div>
      </div>

      {/* Assigned Doctor */}
      {dashboardData?.assignedDoctor && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>👨⚕️ My Doctor</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4>{dashboardData.assignedDoctor.name}</h4>
              <p style={{ color: '#666' }}>Specialization: {dashboardData.assignedDoctor.specialization}</p>
              <p style={{ color: '#666' }}>Email: {dashboardData.assignedDoctor.email}</p>
              <p style={{ color: '#666' }}>Phone: {dashboardData.assignedDoctor.phone}</p>
            </div>
            <button
              onClick={() => setShowBooking(!showBooking)}
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
              📅 Book Appointment
            </button>
          </div>
        </div>
      )}

      {/* Book Appointment Form */}
      {showBooking && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Book Appointment</h3>
          <form onSubmit={handleBookAppointment}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={appointmentForm.doctor}
                onChange={(e) => setAppointmentForm({...appointmentForm, doctor: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
                ))}
              </select>
              <input
                type="date"
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="time"
                value={appointmentForm.time}
                onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
              <input
                type="text"
                placeholder="Reason for visit"
                value={appointmentForm.reason}
                onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#2c5aa0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Book Appointment
            </button>
          </form>
        </div>
      )}

      {/* Messages */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>💬 Messages</h3>
        <div style={{ display: 'grid', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
          {messages.map(message => (
            <div 
              key={message._id} 
              style={{ 
                border: `2px solid ${message.isRead ? '#e1e8ed' : '#4a90e2'}`, 
                padding: '1rem', 
                borderRadius: '8px',
                backgroundColor: message.isRead ? 'white' : '#f0f8ff'
              }}
              onClick={() => !message.isRead && markMessageAsRead(message._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ color: message.isRead ? '#666' : '#2c5aa0' }}>{message.subject}</h4>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: '#666' }}>{message.message}</p>
              {!message.isRead && (
                <span style={{ 
                  display: 'inline-block',
                  padding: '4px 8px',
                  background: '#4a90e2',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginTop: '0.5rem'
                }}>
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>🏃 Recent Activities</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {dashboardData?.activities?.map(activity => (
            <div key={activity._id} style={{ 
              border: '1px solid #e1e8ed', 
              padding: '1rem', 
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4>{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</h4>
                  <p style={{ color: '#666' }}>Duration: {activity.duration} min | Calories: {activity.caloriesBurned}</p>
                  {activity.notes && <p style={{ color: '#888', fontSize: '14px' }}>{activity.notes}</p>}
                </div>
                <span style={{ color: '#888', fontSize: '14px' }}>
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;