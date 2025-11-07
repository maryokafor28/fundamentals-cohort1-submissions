import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { doctorService } from '../services/doctorService';
import { authService } from '../services/authService';
import ImageUpload from '../components/ImageUpload';

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (activeTab === 'patients') fetchPatients();
    if (activeTab === 'doctors') fetchDoctors();
  }, [activeTab]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(activeTab === 'patients' ? 
      { name: '', email: '', age: '', height: '', weight: '', phone: '', profilePicture: '' } :
      { name: '', email: '', specialization: '', phone: '', yearsOfExperience: '', education: '', profilePicture: '' }
    );
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'patients') {
        if (editingItem) {
          await userService.update(editingItem._id, formData);
        } else {
          // Create new patient with auth account
          await authService.register({
            email: formData.email,
            password: 'defaultpass123',
            role: 'patient',
            profileData: formData
          });
        }
        fetchPatients();
      } else {
        if (editingItem) {
          await doctorService.update(editingItem._id, formData);
        } else {
          // Create new doctor with auth account
          await authService.register({
            email: formData.email,
            password: 'defaultpass123',
            role: 'doctor',
            profileData: formData
          });
        }
        fetchDoctors();
      }
      setShowForm(false);
      alert(`${activeTab.slice(0, -1)} ${editingItem ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      alert(`Error ${editingItem ? 'updating' : 'creating'} ${activeTab.slice(0, -1)}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        if (activeTab === 'patients') {
          await userService.delete(id);
          fetchPatients();
        } else {
          await doctorService.delete(id);
          fetchDoctors();
        }
        alert(`${activeTab.slice(0, -1)} deleted successfully!`);
      } catch (error) {
        alert(`Error deleting ${activeTab.slice(0, -1)}`);
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c5aa0', marginBottom: '2rem' }}>🏥 Hospital Management System</h1>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('patients')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'patients' ? '#2c5aa0' : 'white',
            color: activeTab === 'patients' ? 'white' : '#2c5aa0',
            border: '2px solid #2c5aa0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          👥 Patients ({patients.length})
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'doctors' ? '#27ae60' : 'white',
            color: activeTab === 'doctors' ? 'white' : '#27ae60',
            border: '2px solid #27ae60',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          👨⚕️ Doctors ({doctors.length})
        </button>
      </div>

      {/* Action Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={handleCreate}
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
          ➕ Add New {activeTab === 'patients' ? 'Patient' : 'Doctor'}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
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
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>
              {editingItem ? 'Edit' : 'Add New'} {activeTab === 'patients' ? 'Patient' : 'Doctor'}
            </h3>
            <form onSubmit={handleSubmit}>
              <ImageUpload 
                currentImage={formData.profilePicture}
                onImageUploaded={(imageUrl) => setFormData({...formData, profilePicture: imageUrl})}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                />
              </div>

              {activeTab === 'patients' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    required
                    style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                  />
                  <input
                    type="number"
                    placeholder="Height (cm)"
                    value={formData.height || ''}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    required
                    style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                  />
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    required
                    style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Specialization"
                    value={formData.specialization || ''}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    required
                    style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                  />
                  <input
                    type="number"
                    placeholder="Years of Experience"
                    value={formData.yearsOfExperience || ''}
                    onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                    style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
                />
              </div>

              {activeTab === 'doctors' && (
                <input
                  type="text"
                  placeholder="Education"
                  value={formData.education || ''}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px', marginBottom: '1rem' }}
                />
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
                    cursor: 'pointer'
                  }}
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
            {(activeTab === 'patients' ? patients : doctors).map(item => (
              <div key={item._id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                border: '1px solid #e1e8ed',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}>
                <img
                  src={item.profilePicture || (activeTab === 'patients' ? 
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' : 
                    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face')}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c5aa0' }}>{item.name}</h4>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>📧 {item.email}</p>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>📱 {item.phone}</p>
                  {activeTab === 'patients' ? (
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      👤 Age: {item.age} | 📏 {item.height}cm | ⚖️ {item.weight}kg
                    </p>
                  ) : (
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      🏥 {item.specialization} | 📚 {item.yearsOfExperience || 0} years exp.
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      padding: '8px 16px',
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;