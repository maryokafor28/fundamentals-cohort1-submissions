import { useState, useEffect } from 'react';
import { mealService } from '../services/mealService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

// Helper functions for meal images and emojis
const getMealImage = (type) => {
  const mealImages = {
    breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
    lunch: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    dinner: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    snack: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'
  };
  return mealImages[type.toLowerCase()] || 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop';
};

const getMealEmoji = (type) => {
  const emojis = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  };
  return emojis[type.toLowerCase()] || '🍽️';
};

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    name: '',
    type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    dietaryRestrictions: [],
    nutritionalInfo: {
      fiber: '',
      sugar: '',
      sodium: '',
      cholesterol: ''
    }
  });

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await authService.getMe();
      setCurrentUser(response.data.user);
      fetchMeals(response.data.user);
      if (response.data.user.role === 'doctor' || response.data.user.role === 'admin') {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchMeals = async (user = currentUser) => {
    try {
      const response = await mealService.getAll();
      let filteredMeals = response.data;
      
      if (user?.role === 'patient') {
        // Patients see only their own meals
        filteredMeals = response.data.filter(meal => 
          meal.user?._id === user.profile?._id
        );
      }
      // Admin and doctors see all meals
      
      setMeals(filteredMeals);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mealService.create(formData);
      setFormData({
        user: '', name: '', type: 'breakfast', calories: '', protein: '', carbs: '', fat: '',
        dietaryRestrictions: [], nutritionalInfo: { fiber: '', sugar: '', sodium: '', cholesterol: '' }
      });
      setShowForm(false);
      fetchMeals();
    } catch (error) {
      console.error('Error creating meal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await mealService.delete(id);
        fetchMeals();
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🍽️ {currentUser?.role === 'patient' ? 'My Meal Plans' : 'Meal Management'}
        </h1>
        {(currentUser?.role === 'doctor' || currentUser?.role === 'admin') && (
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {showForm ? 'Cancel' : '➕ Add Meal Plan'}
          </button>
        )}
      </div>

      {showForm && (currentUser?.role === 'doctor' || currentUser?.role === 'admin') && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Create Meal Plan</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={formData.user}
                onChange={(e) => setFormData({...formData, user: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              >
                <option value="">Select Patient</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Meal Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
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
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: e.target.value})}
                required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={formData.protein}
                onChange={(e) => setFormData({...formData, protein: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={formData.carbs}
                onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              />
              <input
                type="number"
                placeholder="Fat (g)"
                value={formData.fat}
                onChange={(e) => setFormData({...formData, fat: e.target.value})}
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
              />
            </div>

            <button 
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Create Meal Plan
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {meals.map(meal => (
          <div key={meal._id} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            gap: '1rem'
          }}>
            <img 
              src={meal.image || getMealImage(meal.type)}
              alt={meal.name}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: '#1e40af', margin: 0 }}>
                      {getMealEmoji(meal.type)} {meal.name}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      background: meal.type === 'breakfast' ? '#fef3c7' : 
                                 meal.type === 'lunch' ? '#dbeafe' :
                                 meal.type === 'dinner' ? '#e0e7ff' : '#f3e8ff',
                      color: meal.type === 'breakfast' ? '#92400e' :
                             meal.type === 'lunch' ? '#1e40af' :
                             meal.type === 'dinner' ? '#3730a3' : '#6b21a8',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', margin: '0.25rem 0' }}>
                    👤 Patient: {meal.user?.name || 'Unknown'}
                  </p>
                  {meal.assignedBy && (
                    <p style={{ color: '#27ae60', margin: '0.25rem 0', fontWeight: '600' }}>👨⚕️ Prescribed by Doctor</p>
                  )}
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#059669', fontWeight: '600' }}>🔥 {meal.calories} cal</span>
                    <span style={{ color: '#0891b2' }}>🥩 {meal.protein}g protein</span>
                    <span style={{ color: '#d97706' }}>🍞 {meal.carbs}g carbs</span>
                    <span style={{ color: '#dc2626' }}>🥑 {meal.fat}g fat</span>
                  </div>
                  {meal.notes && (
                    <p style={{ color: '#888', fontSize: '14px', marginTop: '0.5rem', fontStyle: 'italic' }}>📝 {meal.notes}</p>
                  )}
                  <p style={{ color: '#64748b', fontSize: '14px', marginTop: '0.5rem' }}>
                    📅 {new Date(meal.date || meal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
                  <button 
                    onClick={() => handleDelete(meal._id)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {meals.length === 0 && (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#64748b', marginBottom: '1rem' }}>No meal plans yet</h3>
          <p style={{ color: '#94a3b8' }}>Create your first meal plan to get started</p>
        </div>
      )}
    </div>
  );
};

export default Meals;