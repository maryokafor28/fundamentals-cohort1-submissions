const {Schema, model} = require("mongoose")

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [50, 'Full name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profilePhoto: {
    type: String,
    default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  bio: {
    type: String, 
    default: "No bio yet",
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  followers: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  bookmarks: [{
    type: Schema.Types.ObjectId, 
    ref: 'Post'
  }],
  posts: [{
    type: Schema.Types.ObjectId, 
    ref: 'Post'
  }],
}, {
  timestamps: true
})

// Add index for faster queries
userSchema.index({ email: 1 });

module.exports = model('User', userSchema)