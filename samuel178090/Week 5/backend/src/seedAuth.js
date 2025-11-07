import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Auth from './models/Auth.js';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

dotenv.config();

const seedAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing auth data
    await Auth.deleteMany({});

    // Get existing users and doctors
    const users = await User.find().limit(2);
    const doctors = await Doctor.find().limit(2);

    // Create demo auth accounts
    const authAccounts = [
      {
        email: 'admin@demo.com',
        password: 'password',
        role: 'admin',
        profile: users[0]._id // Use first user as admin profile
      },
      {
        email: 'doctor@demo.com',
        password: 'password',
        role: 'doctor',
        profile: doctors[0]._id
      },
      {
        email: 'patient@demo.com',
        password: 'password',
        role: 'patient',
        profile: users[1]._id
      }
    ];

    for (const account of authAccounts) {
      const auth = new Auth(account);
      await auth.save();
      console.log(`Created ${account.role} account: ${account.email}`);
    }

    console.log('Demo auth accounts created successfully!');
    console.log('Login credentials:');
    console.log('Admin: admin@demo.com / password');
    console.log('Doctor: doctor@demo.com / password');
    console.log('Patient: patient@demo.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding auth:', error);
    process.exit(1);
  }
};

seedAuth();