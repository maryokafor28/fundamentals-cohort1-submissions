const authService = require('./auth.service');
const { sendSuccess } = require('../../utils/response');
const { ValidationError } = require('../../utils/errors');

class AuthController {
 
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

    
      if (!email || !password || !name) {
        throw new ValidationError('Email, password, and name are required');
      }

      if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters long');
      }

      const user = await authService.register({ email, password, name });
      sendSuccess(res, 201, { user }, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

    
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      const result = await authService.login(email, password);
      sendSuccess(res, 200, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }


  async getProfile(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);
      sendSuccess(res, 200, { user }, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }


  async getAllUsers(req, res, next) {
    try {
      const users = await authService.getAllUsers();
      sendSuccess(res, 200, { users, count: users.length }, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();