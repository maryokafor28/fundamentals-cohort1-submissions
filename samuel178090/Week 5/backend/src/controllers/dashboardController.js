import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Activity from '../models/Activity.js';
import Appointment from '../models/Appointment.js';
import Message from '../models/Message.js';
import Meal from '../models/Meal.js';

// Admin Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalActivities = await Activity.countDocuments();
    
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentAppointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        totalActivities
      },
      recentUsers,
      recentAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Doctor Dashboard
export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.profile._id;
    
    // Get doctor's patients
    const patients = await User.find({ assignedDoctor: doctorId });
    
    // Get doctor's appointments
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('user', 'name email age')
      .sort({ date: 1 });
    
    // Get recent activities from doctor's patients
    const patientIds = patients.map(p => p._id);
    const recentActivities = await Activity.find({ user: { $in: patientIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get unread messages
    const unreadMessages = await Message.find({
      recipient: doctorId,
      isRead: false
    }).populate('sender', 'name email');

    res.json({
      patients,
      appointments,
      recentActivities,
      unreadMessages,
      stats: {
        totalPatients: patients.length,
        todayAppointments: appointments.filter(apt => 
          new Date(apt.date).toDateString() === new Date().toDateString()
        ).length,
        unreadMessagesCount: unreadMessages.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient Dashboard
export const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user.profile._id;
    
    // Get patient's activities
    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get patient's appointments
    const appointments = await Appointment.find({ user: userId })
      .populate('doctor', 'name specialization')
      .sort({ date: 1 });
    
    // Get unread messages
    const unreadMessages = await Message.find({
      recipient: userId,
      isRead: false
    }).populate('sender', 'name email');

    // Get assigned doctor
    const patient = await User.findById(userId).populate('assignedDoctor', 'name specialization email phone');

    res.json({
      activities,
      appointments,
      unreadMessages,
      assignedDoctor: patient.assignedDoctor,
      stats: {
        totalActivities: activities.length,
        upcomingAppointments: appointments.filter(apt => new Date(apt.date) > new Date()).length,
        unreadMessagesCount: unreadMessages.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign doctor to patient (Admin only)
export const assignDoctorToPatient = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    
    await User.findByIdAndUpdate(patientId, { assignedDoctor: doctorId });
    await Doctor.findByIdAndUpdate(doctorId, { $addToSet: { patients: patientId } });
    
    res.json({ message: 'Doctor assigned successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Doctor assigns activity to patient
export const assignActivityToPatient = async (req, res) => {
  try {
    const { patientId, activityData } = req.body;
    const doctorId = req.user.profile._id;
    
    // Create activity assigned by doctor
    const activity = new Activity({
      ...activityData,
      user: patientId,
      assignedBy: doctorId,
      notes: `Assigned by Dr. ${req.user.profile.name}: ${activityData.notes || ''}`,
      image: activityData.image || getActivityImage(activityData.type)
    });
    
    await activity.save();
    await User.findByIdAndUpdate(patientId, { $push: { activities: activity._id } });
    
    // Send notification to patient
    const notification = new Message({
      sender: doctorId,
      senderModel: 'Doctor',
      recipient: patientId,
      recipientModel: 'User',
      subject: 'New Activity Assigned',
      message: `Your doctor has assigned you a new ${activityData.type} activity.`,
      type: 'activity',
      relatedActivity: activity._id
    });
    
    await notification.save();
    await User.findByIdAndUpdate(patientId, { $push: { messages: notification._id } });
    
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Doctor assigns meal to patient
export const assignMealToPatient = async (req, res) => {
  try {
    const { patientId, mealData } = req.body;
    const doctorId = req.user.profile._id;
    
    const meal = new Meal({
      ...mealData,
      user: patientId,
      assignedBy: doctorId,
      notes: `Prescribed by Dr. ${req.user.profile.name}: ${mealData.notes || ''}`,
      image: mealData.image || getMealImage(mealData.type)
    });
    
    await meal.save();
    await User.findByIdAndUpdate(patientId, { $push: { meals: meal._id } });
    
    // Send notification to patient
    const notification = new Message({
      sender: doctorId,
      senderModel: 'Doctor',
      recipient: patientId,
      recipientModel: 'User',
      subject: 'New Meal Plan Assigned',
      message: `Your doctor has prescribed a new meal plan: ${mealData.name}.`,
      type: 'meal',
      relatedMeal: meal._id
    });
    
    await notification.save();
    await User.findByIdAndUpdate(patientId, { $push: { messages: notification._id } });
    
    res.status(201).json(meal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper functions for default images
const getActivityImage = (type) => {
  const activityImages = {
    running: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
    walking: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    cycling: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    swimming: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
    yoga: 'https://images.unsplash.com/photo-1506629905607-d405b7a82d67?w=400&h=300&fit=crop',
    weightlifting: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    cardio: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  };
  return activityImages[type.toLowerCase()] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
};

const getMealImage = (type) => {
  const mealImages = {
    breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
    lunch: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    dinner: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    snack: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    protein: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    smoothie: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop'
  };
  return mealImages[type.toLowerCase()] || 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop';
};