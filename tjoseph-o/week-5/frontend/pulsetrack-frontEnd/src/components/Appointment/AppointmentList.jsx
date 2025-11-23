import { useState, useEffect } from 'react';
import * as appointmentService from '../../services/appointmentService';
import './AppointmentList.css';

const AppointmentList = ({ onAddAppointment, userId = null }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.getAppointments(userId);
      setAppointments(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(id);
        setAppointments(appointments.filter(appointment => appointment._id !== id));
      } catch (err) {
        alert('Failed to delete appointment: ' + err.message);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await appointmentService.updateAppointment(id, { status: newStatus });
      setAppointments(appointments.map(appt => 
        appt._id === id ? response.data : appt
      ));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { class: 'status-scheduled', label: 'Scheduled' },
      completed: { class: 'status-completed', label: 'Completed' },
      cancelled: { class: 'status-cancelled', label: 'Cancelled' },
      rescheduled: { class: 'status-rescheduled', label: 'Rescheduled' }
    };
    return badges[status] || badges.scheduled;
  };

  const getSpecialtyIcon = (specialty) => {
    const icons = {
      general: '🏥',
      cardiology: '❤️',
      dermatology: '🧴',
      orthopedics: '🦴',
      pediatrics: '👶',
      psychiatry: '🧠',
      other: '⚕️'
    };
    return icons[specialty] || '⚕️';
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="appointment-list">
        <div className="header">
          <h2>Appointments</h2>
          <button className="btn-primary" onClick={onAddAppointment}>Add Appointment</button>
        </div>
        <div className="empty-state">No appointments found</div>
      </div>
    );
  }

  return (
    <div className="appointment-list">
      <div className="header">
        <h2>Appointments</h2>
        <button className="btn-primary" onClick={onAddAppointment}>Add Appointment</button>
      </div>
      
      <div className="appointment-grid">
        {appointments.map(appointment => {
          const statusBadge = getStatusBadge(appointment.status);
          return (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <div className="doctor-info">
                  <span className="specialty-icon">{getSpecialtyIcon(appointment.specialty)}</span>
                  <div>
                    <h3>{appointment.doctorName}</h3>
                    <p className="specialty">{appointment.specialty}</p>
                  </div>
                </div>
                <span className={`status-badge ${statusBadge.class}`}>
                  {statusBadge.label}
                </span>
              </div>
              
              <div className="appointment-details">
                <p className="date">📅 {formatDate(appointment.appointmentDate)}</p>
                {appointment.location && <p className="location">📍 {appointment.location}</p>}
                <p className="reason"><strong>Reason:</strong> {appointment.reason}</p>
                {appointment.notes && <p className="notes">{appointment.notes}</p>}
                {appointment.userId && (
                  <p className="user-info">Patient: {appointment.userId.name}</p>
                )}
              </div>

              <div className="card-actions">
                {appointment.status === 'scheduled' && (
                  <button 
                    className="btn-success"
                    onClick={() => handleStatusChange(appointment._id, 'completed')}
                  >
                    Complete
                  </button>
                )}
                <button 
                  className="btn-danger" 
                  onClick={() => handleDelete(appointment._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentList;