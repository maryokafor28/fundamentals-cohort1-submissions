import { useState } from 'react';
import './AppointmentForm.css';

const AppointmentForm = ({ onSubmit, onCancel, users = [] }) => {
  const [formData, setFormData] = useState({
    userId: '',
    doctorName: '',
    specialty: '',
    appointmentDate: '',
    reason: '',
    location: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const specialties = ['general', 'cardiology', 'dermatology', 'orthopedics', 'pediatrics', 'psychiatry', 'other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) {
      newErrors.userId = 'User is required';
    }

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Doctor name is required';
    }

    if (!formData.specialty) {
      newErrors.specialty = 'Specialty is required';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = { ...formData };
      
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          delete submitData[key];
        }
      });

      onSubmit(submitData);
    }
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="userId">User *</label>
        <select
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className={errors.userId ? 'error' : ''}
        >
          <option value="">Select user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.userId && <span className="error-message">{errors.userId}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="doctorName">Doctor Name *</label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className={errors.doctorName ? 'error' : ''}
          />
          {errors.doctorName && <span className="error-message">{errors.doctorName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="specialty">Specialty *</label>
          <select
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className={errors.specialty ? 'error' : ''}
          >
            <option value="">Select specialty</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>
                {spec.charAt(0).toUpperCase() + spec.slice(1)}
              </option>
            ))}
          </select>
          {errors.specialty && <span className="error-message">{errors.specialty}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="appointmentDate">Appointment Date & Time *</label>
        <input
          type="datetime-local"
          id="appointmentDate"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          className={errors.appointmentDate ? 'error' : ''}
        />
        {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="reason">Reason for Visit *</label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows="3"
          maxLength="500"
          placeholder="Describe the reason for this appointment..."
          className={errors.reason ? 'error' : ''}
        />
        {errors.reason && <span className="error-message">{errors.reason}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., City Hospital, Room 301"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          maxLength="1000"
          placeholder="Any additional information..."
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;