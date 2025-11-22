import { useState, useEffect } from 'react';
import AppointmentList from '../../components/Appointment/AppointmentList';
import AppointmentForm from '../../components/Appointment/AppointmentForm';
import * as appointmentService from '../../services/appointmentService';
import * as userService from '../../services/userService';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddAppointment = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (appointmentData) => {
    try {
      await appointmentService.createAppointment(appointmentData);
      setShowForm(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      alert('Failed to create appointment: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loadingUsers) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="appointments-page">
      {showForm ? (
        <div className="form-container">
          <h2>Schedule New Appointment</h2>
          <AppointmentForm onSubmit={handleSubmit} onCancel={handleCancel} users={users} />
        </div>
      ) : (
        <AppointmentList key={refreshKey} onAddAppointment={handleAddAppointment} />
      )}
    </div>
  );
};

export default AppointmentsPage;