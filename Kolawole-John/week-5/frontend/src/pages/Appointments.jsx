import { useState, useEffect } from 'react';
import { appointmentAPI, userAPI } from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll();
      setAppointments(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      // Mock doctors data for now until backend is ready
      setDoctors([
        {
          _id: '1',
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiology'
        },
        {
          _id: '2',
          name: 'Dr. Michael Chen',
          specialization: 'Dermatology'
        },
        {
          _id: '3',
          name: 'Dr. Amina Bello',
          specialization: 'Pediatrics'
        }
      ]);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentAPI.create(formData);
      setShowForm(false);
      setFormData({
        user: '',
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: '',
        status: 'scheduled'
      });
      fetchAppointments();
      alert('✅ Appointment booked successfully!');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Failed to book appointment'));
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentAPI.update(id, { status: newStatus });
      fetchAppointments();
      alert('✅ Appointment status updated!');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Failed to update status'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        fetchAppointments();
        alert('✅ Appointment cancelled successfully!');
      } catch (err) {
        alert('❌ ' + (err.response?.data?.message || 'Failed to cancel appointment'));
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>❌ Error: {error}</p>
          <button onClick={fetchAppointments} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>📅 Appointments Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ Book New Appointment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="user">Select Patient *</label>
              <select 
                id="user"
                name="user" 
                value={formData.user} 
                onChange={handleInputChange}
                required
              >
                <option value="">-- Choose Patient --</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="doctor">Select Doctor *</label>
              <select 
                id="doctor"
                name="doctor" 
                value={formData.doctor} 
                onChange={handleInputChange}
                required
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date *</label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentTime">Appointment Time *</label>
              <input
                type="time"
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Visit *</label>
            <input
              type="text"
              id="reason"
              name="reason"
              placeholder="e.g., Regular checkup, Follow-up consultation"
              value={formData.reason}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any additional information for the doctor..."
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-success">✓ Book Appointment</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments scheduled. Book one now!</p>
        </div>
      ) : (
        <div className="items-list">
          {appointments.map(appointment => (
            <div key={appointment._id} className="card">
              <div className="card-header">
                <h3 className="card-title">
                  🩺 {appointment.doctor?.name || 'Unknown Doctor'}
                </h3>
                <span className={`badge badge-${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="card-body">
                <div className="card-info">
                  <strong>👤 Patient:</strong> {appointment.user?.name || 'Unknown'}
                </div>
                <div className="card-info">
                  <strong>🏥 Specialization:</strong> {appointment.doctor?.specialization || 'N/A'}
                </div>
                <div className="card-info">
                  <strong>📅 Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                </div>
                <div className="card-info">
                  <strong>⏰ Time:</strong> {appointment.appointmentTime}
                </div>
                <div className="card-info">
                  <strong>📋 Reason:</strong> {appointment.reason}
                </div>
                {appointment.notes && (
                  <div className="card-info">
                    <strong>📝 Notes:</strong> {appointment.notes}
                  </div>
                )}
              </div>
              
              <div className="card-actions">
                {appointment.status === 'scheduled' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(appointment._id, 'completed')} 
                      className="btn-success btn-sm"
                    >
                      ✓ Complete
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(appointment._id, 'cancelled')} 
                      className="btn-warning btn-sm"
                    >
                      ✕ Cancel
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(appointment._id)} className="btn-danger btn-sm">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments;