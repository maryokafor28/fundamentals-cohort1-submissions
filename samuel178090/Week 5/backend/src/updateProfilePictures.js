import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

dotenv.config();

const updateProfilePictures = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Professional patient profile pictures (diverse, realistic)
    const patientImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
    ];

    // Professional doctor profile pictures (medical professionals)
    const doctorImages = [
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1594824475317-87b0b5b7e3c5?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face'
    ];

    // Update patients with realistic profile pictures
    const patients = await User.find();
    for (let i = 0; i < patients.length; i++) {
      const imageUrl = patientImages[i % patientImages.length];
      await User.findByIdAndUpdate(patients[i]._id, {
        profilePicture: imageUrl
      });
      console.log(`Updated patient ${patients[i].name} with profile picture`);
    }

    // Update doctors with professional medical photos
    const doctors = await Doctor.find();
    for (let i = 0; i < doctors.length; i++) {
      const imageUrl = doctorImages[i % doctorImages.length];
      await Doctor.findByIdAndUpdate(doctors[i]._id, {
        profilePicture: imageUrl
      });
      console.log(`Updated doctor ${doctors[i].name} with profile picture`);
    }

    console.log('All profile pictures updated successfully!');
    console.log(`Updated ${patients.length} patients and ${doctors.length} doctors`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating profile pictures:', error);
    process.exit(1);
  }
};

updateProfilePictures();