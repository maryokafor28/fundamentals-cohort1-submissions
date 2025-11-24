const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,  // Removes whitespace
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,  // No duplicate emails
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,  // Don't return in queries by default
  },
  bio: String,
  skills: [String],
  githubUrl: String,
  linkedinUrl: String,
}, {
  timestamps: true,  // Auto-adds createdAt, updatedAt
});

// Index for fast email lookups
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is new/modified
  if (!this.isModified('password')) return next();
  
  // Generate salt and hash
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);