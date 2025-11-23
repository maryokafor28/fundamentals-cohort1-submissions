const bcrypt = require('bcrypt');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const { validateEmail, validatePassword, sanitizeInput } = require('../utils/validators');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} = require('../utils/jwtUtils');


async function register(req, res) {
  try {
    let { email, password } = req.body;

    email = sanitizeInput(email).toLowerCase();

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'user' 
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
}


async function login(req, res) {
  try {
    let { email, password } = req.body;

    email = sanitizeInput(email).toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account is locked. Please try again in ${lockTimeRemaining} minutes.`
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      await user.resetLoginAttempts();
    }

    const tokenId = `${user._id}-${Date.now()}`;
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      tokenId
    });

    await User.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: { token: refreshToken } } }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
}


async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const blacklisted = await BlacklistedToken.findOne({ token: refreshToken });
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const tokenExists = user.refreshTokens.some(
      t => t.token === refreshToken
    );
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found'
      });
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role
    });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message
    });
  }
}


async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (decoded) {
      const jwt = require('jsonwebtoken');
      const tokenDecoded = jwt.decode(refreshToken);
      const expiresAt = new Date(tokenDecoded.exp * 1000);

      await BlacklistedToken.create({
        token: refreshToken,
        expiresAt
      });

      await User.updateOne(
        { _id: decoded.userId },
        { $pull: { refreshTokens: { token: refreshToken } } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout
};