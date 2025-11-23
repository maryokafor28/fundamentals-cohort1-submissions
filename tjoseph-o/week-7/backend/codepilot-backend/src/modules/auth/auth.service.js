const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../../utils/errors');


const users = new Map();

class AuthService {

  async register(userData) {
    const { email, password, name, role = 'user' } = userData;

   
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role: role,
      createdAt: new Date().toISOString()
    };

    users.set(user.id, user);

   
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

 
  async login(email, password) {
    // Find user by email
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   * @param {String} userId - User ID
   * @returns {Object} User object without password
   */
  async getUserById(userId) {
    const user = users.get(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users
   * @returns {Array} Array of users without passwords
   */
  async getAllUsers() {
    return Array.from(users.values()).map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Clear all users (for testing)
   */
  clearUsers() {
    users.clear();
  }

  /**
   * Get user count (for testing)
   */
  getUserCount() {
    return users.size;
  }
}

module.exports = new AuthService();