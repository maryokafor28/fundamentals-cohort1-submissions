const { User } = require('../models');
const { AppError } = require('../middleware/error');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

exports.register = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ where: { email: req.validatedData.email } });
    if (userExists) {
      throw new AppError(400, 'Email already registered');
    }

    const user = await User.create(req.validatedData);
    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user.id);

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'email', 'firstName', 'lastName', 'status', 'createdAt']
    });

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'status', 'createdAt']
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await user.update(req.validatedData);

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Soft delete by updating status
    await user.update({ status: 'inactive' });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};