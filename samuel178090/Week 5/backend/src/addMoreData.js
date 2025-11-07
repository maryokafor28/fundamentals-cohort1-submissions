import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Activity from './models/Activity.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const addMoreData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Add more users
    const newUsers = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        age: 25,
        height: 160,
        weight: 55
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        age: 35,
        height: 180,
        weight: 80
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        age: 42,
        height: 165,
        weight: 65
      }
    ]);

    // Add more doctors
    const newDoctors = await Doctor.create([
      {
        name: 'Dr. Emily Chen',
        specialization: 'Dermatology',
        email: 'emily.chen@clinic.com',
        phone: '+1234567892'
      },
      {
        name: 'Dr. James Rodriguez',
        specialization: 'Orthopedics',
        email: 'james.rodriguez@hospital.com',
        phone: '+1234567893'
      }
    ]);

    // Get all users and doctors for activities and appointments
    const allUsers = await User.find();
    const allDoctors = await Doctor.find();

    // Add more activities
    const newActivities = await Activity.create([
      {
        user: newUsers[0]._id,
        type: 'cycling',
        duration: 60,
        caloriesBurned: 450,
        notes: 'Weekend bike ride'
      },
      {
        user: newUsers[1]._id,
        type: 'swimming',
        duration: 45,
        caloriesBurned: 400,
        notes: 'Pool workout'
      },
      {
        user: newUsers[2]._id,
        type: 'gym',
        duration: 90,
        caloriesBurned: 350,
        notes: 'Strength training'
      },
      {
        user: allUsers[0]._id,
        type: 'walking',
        duration: 30,
        caloriesBurned: 150,
        notes: 'Evening walk'
      }
    ]);

    // Add more appointments
    const newAppointments = await Appointment.create([
      {
        user: newUsers[0]._id,
        doctor: newDoctors[0]._id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '14:30',
        reason: 'Skin consultation',
        status: 'scheduled'
      },
      {
        user: newUsers[1]._id,
        doctor: newDoctors[1]._id,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '09:00',
        reason: 'Knee pain evaluation',
        status: 'scheduled'
      },
      {
        user: newUsers[2]._id,
        doctor: allDoctors[1]._id,
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '11:15',
        reason: 'Annual physical',
        status: 'scheduled'
      }
    ]);

    // Update user references
    for (let i = 0; i < newUsers.length; i++) {
      await User.findByIdAndUpdate(newUsers[i]._id, {
        $push: { 
          activities: newActivities[i]._id,
          appointments: newAppointments[i]._id
        }
      });
    }

    // Update existing user with new activity
    await User.findByIdAndUpdate(allUsers[0]._id, {
      $push: { activities: newActivities[3]._id }
    });

    // Update doctor references
    await Doctor.findByIdAndUpdate(newDoctors[0]._id, {
      $push: { appointments: newAppointments[0]._id }
    });
    await Doctor.findByIdAndUpdate(newDoctors[1]._id, {
      $push: { appointments: newAppointments[1]._id }
    });
    await Doctor.findByIdAndUpdate(allDoctors[1]._id, {
      $push: { appointments: newAppointments[2]._id }
    });

    console.log('Additional sample data created successfully!');
    console.log(`Total Users: ${allUsers.length + newUsers.length}`);
    console.log(`Total Doctors: ${allDoctors.length + newDoctors.length}`);
    console.log(`Total Activities: ${newActivities.length + 2}`);
    console.log(`Total Appointments: ${newAppointments.length + 1}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding data:', error);
    process.exit(1);
  }
};

addMoreData();