const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  age: {
    type: Number,
    min: [1, 'Age must be positive'],
    max: [120, 'Age must be realistic']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  height: Number, // in cm
  weight: Number, // in kg
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);