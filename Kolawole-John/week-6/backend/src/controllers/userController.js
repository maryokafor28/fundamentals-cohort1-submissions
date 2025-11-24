const userService = require('../services/userService');
const { successResponse } = require('../utils/response');

const UserController = {
  getAllUsers: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await userService.getAll(page, limit);
      
      res.status(200).json(successResponse(
        'Users retrieved successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const result = await userService.getById(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      res.status(200).json(successResponse(
        'User retrieved successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const result = await userService.create(req.body);
      res.status(201).json(successResponse(
        'User created successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const result = await userService.update(req.params.id, req.body);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      res.status(200).json(successResponse(
        'User updated successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const result = await userService.delete(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;