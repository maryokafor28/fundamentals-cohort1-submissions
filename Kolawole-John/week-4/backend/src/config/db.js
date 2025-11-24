const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,  // Max 10 connections in pool
      minPoolSize: 2,   // Min 2 connections always ready
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);  // Exit if database fails
  }
};

module.exports = connectDB;