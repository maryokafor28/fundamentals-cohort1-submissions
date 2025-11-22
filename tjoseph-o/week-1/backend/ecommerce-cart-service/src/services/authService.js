const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {

  static async register(userData) {
    try {
      const { username, email, password } = userData;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return {
          success: false,
          error: existingUser.email === email 
            ? 'Email already exists' 
            : 'Username already exists'
        };
      }

      const user = new User({
        username,
        email,
        password
      });

      await user.save();

      const token = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      return {
        success: true,
        user: user.toJSON(),
        token,
        refreshToken
      };

    } catch (error) {
      if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map(err => err.message);
        return {
          success: false,
          error: errorMessages.join(', ')
        };
      }

      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }


  static async login(email, password) {
    try {
      const user = await User.findByCredentials(email, password);

      const token = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      return {
        success: true,
        user: user.toJSON(),
        token,
        refreshToken
      };

    } catch (error) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
  }


  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      const user = await User.findById(decoded.id);
      
      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'User not found or inactive'
        };
      }

      return {
        success: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role
        },
        decoded
      };

    } catch (error) {
      let errorMessage = 'Invalid token';
      
      if (error.name === 'TokenExpiredError') {
        errorMessage = 'Token expired';
      } else if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

 
  static async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken, 
        process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
      );

      if (decoded.type !== 'refresh') {
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      const user = await User.findById(decoded.id);
      
      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'User not found or inactive'
        };
      }

      const newToken = user.generateAuthToken();
      const newRefreshToken = user.generateRefreshToken();

      return {
        success: true,
        token: newToken,
        refreshToken: newRefreshToken,
        user: user.toJSON()
      };

    } catch (error) {
      let errorMessage = 'Invalid refresh token';
      
      if (error.name === 'TokenExpiredError') {
        errorMessage = 'Refresh token expired';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }


  static async logout(userId) {
    try {
    

      const user = await User.findById(userId);
      if (user) {
        user.lastLogin = new Date();
        await user.save();
      }

      return {
        success: true,
        message: 'Logged out successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Logout failed'
      };
    }
  }

  
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

     
      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: 'Password updated successfully'
      };

    } catch (error) {
      if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map(err => err.message);
        return {
          success: false,
          error: errorMessages.join(', ')
        };
      }

      return {
        success: false,
        error: 'Password change failed'
      };
    }
  }

 
  static async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user: user.toJSON()
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to get user profile'
      };
    }
  }
}

module.exports = AuthService;