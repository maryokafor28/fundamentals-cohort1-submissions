import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Activity from './models/Activity.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Activity.deleteMany({});
    await Appointment.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        height: 175,
        weight: 70
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 28,
        height: 165,
        weight: 60
      }
    ]);

    // Create sample doctors
    const doctors = await Doctor.create([
      {
        name: 'Dr. Sarah Wilson',
        specialization: 'Cardiology',
        email: 'sarah.wilson@hospital.com',
        phone: '+1234567890'
      },
      {
        name: 'Dr. Michael Brown',
        specialization: 'General Practice',
        email: 'michael.brown@clinic.com',
        phone: '+1234567891'
      }
    ]);

    // Create sample activities
    const activities = await Activity.create([
      {
        user: users[0]._id,
        type: 'running',
        duration: 30,
        caloriesBurned: 300,
        date: new Date(),
        notes: 'Morning run in the park'
      },
      {
        user: users[1]._id,
        type: 'yoga',
        duration: 45,
        caloriesBurned: 150,
        date: new Date(),
        notes: 'Evening yoga session'
      }
    ]);

    // Create sample appointments
    const appointments = await Appointment.create([
      {
        user: users[0]._id,
        doctor: doctors[0]._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '10:00 AM',
        reason: 'Regular checkup',
        status: 'scheduled'
      }
    ]);

    // Update user references
    await User.findByIdAndUpdate(users[0]._id, {
      $push: { 
        activities: activities[0]._id,
        appointments: appointments[0]._id
      }
    });

    await User.findByIdAndUpdate(users[1]._id, {
      $push: { activities: activities[1]._id }
    });

    // Update doctor references
    await Doctor.findByIdAndUpdate(doctors[0]._id, {
      $push: { appointments: appointments[0]._id }
    });

    console.log('Sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();