const AuthService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, schemas } = require('../middleware/validation');

class AuthController {

 
   
  static register = [
    validate(schemas.register),
    asyncHandler(async (req, res) => {
      const { username, email, password } = req.body;

      const result = await AuthService.register({
        username,
        email,
        password
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      });
    })
  ];

 
  static login = [
    validate(schemas.login),
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      if (!result.success) {
        return res.status(401).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      });
    })
  ];

 
  static refreshToken = [
    validate(schemas.refreshToken),
    asyncHandler(async (req, res) => {
      const { refreshToken } = req.body;

      const result = await AuthService.refreshToken(refreshToken);

      if (!result.success) {
        return res.status(401).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user
      });
    })
  ];

 
  static logout = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await AuthService.logout(userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });

 
  static getMe = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await AuthService.getProfile(userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      user: result.user
    });
  });


  static changePassword = [
    validate(schemas.changePassword),
    asyncHandler(async (req, res) => {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const result = await AuthService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message
      });
    })
  ];

 
  static verifyToken = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    const result = await AuthService.verifyToken(token);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      user: result.user
    });
  });
}

module.exports = AuthController;