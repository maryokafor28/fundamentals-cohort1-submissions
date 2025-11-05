const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minLength: [2, 'Username must be at least 2 characters'],
    maxLength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
