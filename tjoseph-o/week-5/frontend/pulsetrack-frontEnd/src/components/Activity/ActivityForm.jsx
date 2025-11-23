import { useState } from 'react';
import './ActivityForm.css';

const ActivityForm = ({ onSubmit, onCancel, users = [] }) => {
  const [formData, setFormData] = useState({
    userId: '',
    activityType: '',
    duration: '',
    distance: '',
    caloriesBurned: '',
    date: new Date().toISOString().slice(0, 16),
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const activityTypes = ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'other'];

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

    if (!formData.activityType) {
      newErrors.activityType = 'Activity type is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (Number(formData.duration) < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = { ...formData };
      if (submitData.duration) submitData.duration = Number(submitData.duration);
      if (submitData.distance) submitData.distance = Number(submitData.distance);
      if (submitData.caloriesBurned) submitData.caloriesBurned = Number(submitData.caloriesBurned);
      
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          delete submitData[key];
        }
      });

      onSubmit(submitData);
    }
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
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

      <div className="form-group">
        <label htmlFor="activityType">Activity Type *</label>
        <select
          id="activityType"
          name="activityType"
          value={formData.activityType}
          onChange={handleChange}
          className={errors.activityType ? 'error' : ''}
        >
          <option value="">Select activity type</option>
          {activityTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {errors.activityType && <span className="error-message">{errors.activityType}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes) *</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && <span className="error-message">{errors.duration}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="distance">Distance (km)</label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="caloriesBurned">Calories Burned</label>
          <input
            type="number"
            id="caloriesBurned"
            name="caloriesBurned"
            value={formData.caloriesBurned}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date & Time</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          maxLength="500"
          placeholder="Add any notes about this activity..."
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

export default ActivityForm;