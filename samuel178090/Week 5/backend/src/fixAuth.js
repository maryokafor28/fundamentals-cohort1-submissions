import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Auth from './models/Auth.js';

dotenv.config();

const fixAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update existing auth records to add profileModel
    await Auth.updateMany(
      { role: 'patient' },
      { $set: { profileModel: 'User' } }
    );

    await Auth.updateMany(
      { role: 'doctor' },
      { $set: { profileModel: 'Doctor' } }
    );

    await Auth.updateMany(
      { role: 'admin' },
      { $set: { profileModel: 'User' } }
    );

    console.log('Auth records updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing auth:', error);
    process.exit(1);
  }
};

fixAuth();