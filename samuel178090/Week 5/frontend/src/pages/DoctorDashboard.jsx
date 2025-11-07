import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { messageService } from '../services/messageService';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showMealForm, setShowMealForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [activityForm, setActivityForm] = useState({
    type: 'walking',
    duration: '',
    caloriesBurned: '',
    notes: ''
  });
  const [mealForm, setMealForm] = useState({
    name: '',
    type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDoctorDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignActivity = async (e) => {
    e.preventDefault();
    try {
      await dashboardService.assignActivityToPatient({
        patientId: selectedPatient,
        activityData: activityForm
      });
      alert('Activity assigned successfully!');
      setShowAssignForm(false);
      setActivityForm({ type: 'walking', duration: '', caloriesBurned: '', notes: '' });
      fetchDashboardData();
    } catch (error) {
      alert('Error assigning activity');
    }
  };

  const handleAssignMeal = async (e) => {
    e.preventDefault();
    try {
      await dashboardService.assignMealToPatient({
        patientId: selectedPatient,
        mealData: mealForm
      });
      alert('Meal plan assigned successfully!');
      setShowMealForm(false);
      setMealForm({ name: '', type: 'breakfast', calories: '', protein: '', carbs: '', fat: '', notes: '' });
      fetchDashboardData();
    } catch (error) {
      alert('Error assigning meal plan');
    }
  };

  const sendMessageToPatient = async (patientId, patientName) => {
    const message = prompt(`Send message to ${patientName}:`);
    if (message) {
      try {
        await messageService.sendMessage({
          recipientId: patientId,
          recipientModel: 'User',
          subject: 'Message from your Doctor',
          message,
          type: 'general'
        });
        alert('Message sent successfully!');
      } catch (error) {
        alert('Error sending message');
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c5aa0', marginBottom: '2rem' }}>👨⚕️ Doctor Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>👥 My Patients</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{dashboardData?.stats?.totalPatients || 0}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>📅 Today's Appointments</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>{dashboardData?.stats?.todayAppointments || 0}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0' }}>💬 Unread Messages</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{dashboardData?.stats?.unreadMessagesCount || 0}</p>
        </div>
      </div>

      {/* Assignment Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => {
            setShowAssignForm(!showAssignForm);
            setShowMealForm(false);
          }}
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
          {showAssignForm ? 'Cancel' : '🏃 Assign Activity'}
        </button>
        <button
          onClick={() => {
            setShowMealForm(!showMealForm);
            setShowAssignForm(false);
          }}
          style={{
            padding: '12px 24px',
            background: '#e67e22',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {showMealForm ? 'Cancel' : '🍽️ Assign Meal Plan'}
        </button>
      </div>

      {/* Assign Activity Form */}
      {showAssignForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>🏃 Assign Activity</h3>
          <form onSubmit={handleAssignActivity}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              >
                <option value="">Select Patient</option>
                {dashboardData?.patients?.map(patient => (
                  <option key={patient._id} value={patient._id}>{patient.name}</option>
                ))}
              </select>
              <select
                value={activityForm.type}
                onChange={(e) => setActivityForm({...activityForm, type: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              >
                <option value="walking">🚶 Walking</option>
                <option value="running">🏃 Running</option>
                <option value="cycling">🚴 Cycling</option>
                <option value="swimming">🏊 Swimming</option>
                <option value="weightlifting">🏋️ Weight Lifting</option>
                <option value="yoga">🧘 Yoga</option>
                <option value="cardio">❤️ Cardio</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={activityForm.duration}
                onChange={(e) => setActivityForm({...activityForm, duration: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
              <input
                type="number"
                placeholder="Target Calories"
                value={activityForm.caloriesBurned}
                onChange={(e) => setActivityForm({...activityForm, caloriesBurned: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
            </div>
            <textarea
              placeholder="Instructions/Notes"
              value={activityForm.notes}
              onChange={(e) => setActivityForm({...activityForm, notes: e.target.value})}
              style={{ width: '100%', padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px', marginBottom: '1rem', minHeight: '80px' }}
            />
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
              Assign Activity
            </button>
          </form>
        </div>
      )}

      {/* Assign Meal Form */}
      {showMealForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>🍽️ Assign Meal Plan</h3>
          <form onSubmit={handleAssignMeal}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              >
                <option value="">Select Patient</option>
                {dashboardData?.patients?.map(patient => (
                  <option key={patient._id} value={patient._id}>{patient.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Meal Name"
                value={mealForm.name}
                onChange={(e) => setMealForm({...mealForm, name: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
              <select
                value={mealForm.type}
                onChange={(e) => setMealForm({...mealForm, type: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              >
                <option value="breakfast">🌅 Breakfast</option>
                <option value="lunch">☀️ Lunch</option>
                <option value="dinner">🌙 Dinner</option>
                <option value="snack">🍎 Snack</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Calories"
                value={mealForm.calories}
                onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={mealForm.protein}
                onChange={(e) => setMealForm({...mealForm, protein: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={mealForm.carbs}
                onChange={(e) => setMealForm({...mealForm, carbs: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
              <input
                type="number"
                placeholder="Fat (g)"
                value={mealForm.fat}
                onChange={(e) => setMealForm({...mealForm, fat: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px' }}
              />
            </div>
            <textarea
              placeholder="Dietary Instructions/Notes"
              value={mealForm.notes}
              onChange={(e) => setMealForm({...mealForm, notes: e.target.value})}
              style={{ width: '100%', padding: '12px', border: '2px solid #e1e8ed', borderRadius: '8px', marginBottom: '1rem', minHeight: '80px' }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Assign Meal Plan
            </button>
          </form>
        </div>
      )}

      {/* My Patients */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>My Patients</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {dashboardData?.patients?.map(patient => (
            <div key={patient._id} style={{ 
              border: '1px solid #e1e8ed', 
              padding: '1rem', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4>{patient.name}</h4>
                <p style={{ color: '#666' }}>Age: {patient.age} | Email: {patient.email}</p>
                <p style={{ color: '#666' }}>Height: {patient.height}cm | Weight: {patient.weight}kg</p>
              </div>
              <button
                onClick={() => sendMessageToPatient(patient._id, patient.name)}
                style={{
                  padding: '8px 16px',
                  background: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                💬 Send Message
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Recent Patient Activities</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {dashboardData?.recentActivities?.map(activity => (
            <div key={activity._id} style={{ 
              border: '1px solid #e1e8ed', 
              padding: '1rem', 
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4>{activity.user?.name} - {activity.type}</h4>
                  <p style={{ color: '#666' }}>Duration: {activity.duration} min | Calories: {activity.caloriesBurned}</p>
                  <p style={{ color: '#888', fontSize: '14px' }}>{new Date(activity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;