import jwt from 'jsonwebtoken';
import Auth from '../models/Auth.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

// Register
export const register = async (req, res) => {
  try {
    const { email, password, role, profileData } = req.body;

    // Check if user exists
    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create profile based on role
    let profile, profileModel;
    if (role === 'patient') {
      profile = new User(profileData);
      profileModel = 'User';
    } else if (role === 'doctor') {
      profile = new Doctor(profileData);
      profileModel = 'Doctor';
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await profile.save();

    // Create auth record
    const auth = new Auth({
      email,
      password,
      role,
      profile: profile._id,
      profileModel
    });

    await auth.save();

    const token = generateToken(auth._id);

    res.status(201).json({
      token,
      user: {
        id: auth._id,
        email: auth.email,
        role: auth.role,
        profile: profile
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const auth = await Auth.findOne({ email }).populate('profile');
    if (!auth || !await auth.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!auth.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const token = generateToken(auth._id);

    res.json({
      token,
      user: {
        id: auth._id,
        email: auth.email,
        role: auth.role,
        profile: auth.profile
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const auth = await Auth.findById(req.user.id).populate('profile');
    res.json({
      user: {
        id: auth._id,
        email: auth.email,
        role: auth.role,
        profile: auth.profile
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};