
const { 
  validateEmail, 
  validatePassword, 
  sanitizeInput, 
  validateTaskInput 
} = require('../utils/validators');

function validateRegistration(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

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

    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(400).json({
      success: false,
      message: 'Validation failed'
    });
  }
}

function validateLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(400).json({
      success: false,
      message: 'Validation failed'
    });
  }
}

function validateTask(req, res, next) {
  try {
    let { title, description } = req.body;

    title = sanitizeInput(title);
    description = sanitizeInput(description);

    req.body.title = title;
    req.body.description = description;

    const validation = validateTaskInput(title, description);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Task validation failed',
        errors: validation.errors
      });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(400).json({
      success: false,
      message: 'Validation failed'
    });
  }
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateTask
};
