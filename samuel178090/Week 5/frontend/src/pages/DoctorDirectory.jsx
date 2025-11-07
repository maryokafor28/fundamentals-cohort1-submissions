import { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';

const DoctorDirectory = ({ currentUser }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;
    
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialty);
    }
    
    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create({
        user: currentUser?.profile?._id,
        doctor: selectedDoctor._id,
        date: appointmentForm.date,
        time: appointmentForm.time,
        reason: appointmentForm.reason
      });
      alert('Appointment booked successfully!');
      setShowBooking(false);
      setAppointmentForm({ date: '', time: '', reason: '' });
    } catch (error) {
      alert('Error booking appointment');
    }
  };

  const specialties = [...new Set(doctors.map(doctor => doctor.specialization))];

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading doctors...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c5aa0', marginBottom: '2rem', textAlign: 'center' }}>
        🏥 Find Your Doctor
      </h1>

      {/* Search and Filter */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <input
            type="text"
            placeholder="🔍 Search by doctor name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2rem' 
      }}>
        {filteredDoctors.map(doctor => (
          <div key={doctor._id} style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            border: '1px solid #e1e8ed'
          }}>
            {/* Doctor Photo */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
              <img
                src={doctor.profilePicture || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face'}
                alt={doctor.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: doctor.isAvailable ? '#27ae60' : '#e74c3c',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {doctor.isAvailable ? '🟢 Available' : '🔴 Busy'}
              </div>
            </div>

            {/* Doctor Info */}
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#2c5aa0', 
                fontSize: '1.3rem',
                fontWeight: '700'
              }}>
                Dr. {doctor.name}
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ 
                  margin: '0.25rem 0', 
                  color: '#27ae60', 
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  🏥 {doctor.specialization}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '14px' }}>
                  📚 {doctor.yearsOfExperience || 0} years of experience
                </p>
                <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '14px' }}>
                  📧 {doctor.email}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '14px' }}>
                  📱 {doctor.phone}
                </p>
                {doctor.education && (
                  <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '14px' }}>
                    🎓 {doctor.education}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  disabled={!doctor.isAvailable}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: doctor.isAvailable ? '#2c5aa0' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: doctor.isAvailable ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  📅 Book Appointment
                </button>
                <button
                  style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    color: '#2c5aa0',
                    border: '2px solid #2c5aa0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  💬
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#666' }}>No doctors found</h3>
          <p style={{ color: '#888' }}>Try adjusting your search criteria</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c5aa0' }}>
              Book Appointment with Dr. {selectedDoctor?.name}
            </h3>
            <form onSubmit={handleSubmitAppointment}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Preferred Date:
                </label>
                <input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Preferred Time:
                </label>
                <select
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                >
                  <option value="">Select Time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Reason for Visit:
                </label>
                <textarea
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                  required
                  placeholder="Please describe your symptoms or reason for the visit..."
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e1e8ed', 
                    borderRadius: '8px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDirectory;