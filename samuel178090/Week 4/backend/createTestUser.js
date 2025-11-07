const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import your user model
const UserModel = require('./models/userModel');

const createTestUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Check if test user already exists
        const existingUser = await UserModel.findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('Test user already exists!');
            console.log('Email: test@example.com');
            console.log('Password: password123');
            process.exit(0);
        }

        // Create test user
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const testUser = await UserModel.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: hashedPassword
        });

        console.log('✅ Test user created successfully!');
        console.log('Email: test@example.com');
        console.log('Password: password123');
        console.log('User ID:', testUser._id);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test user:', error);
        process.exit(1);
    }
};

createTestUser();