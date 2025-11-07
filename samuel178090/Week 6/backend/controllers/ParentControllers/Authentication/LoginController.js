import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from '../../../repositories/UserRepository.js';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_KEY;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h'; // 24 hours default

/**
 * User login controller
 * @route POST /auth/login
 * @body { phone: string, password: string }
 */
export const login = async (req, res, next) => {
  try {
    // Input validation
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ 
        message: "Phone number and password are required" 
      });
    }

    // Validate phone format (11 digits)
    if (!/^\d{11}$/.test(phone)) {
      return res.status(400).json({ 
        message: "Invalid phone number format" 
      });
    }

    // Find user by phone
    const user = await userRepository.findUserByPhone(phone);

    if (!user) {
      // Generic error to prevent user enumeration
      return res.status(401).json({ 
        message: "Invalid phone number or password" 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Same generic error message
      return res.status(401).json({ 
        message: "Invalid phone number or password" 
      });
    }

    // Check if user is active (optional - add if you have user status)
    // if (user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
    //   return res.status(403).json({ 
    //     message: "Account is not active" 
    //   });
    // }

    // Generate JWT token
    const token = createJWT(user.UID);

    // Optional: Update last login timestamp
    // await userRepository.updateLastLogin(user.UID);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      userID: user.UID,
      token: token,
      user: {
        id: user.UID,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Don't expose internal errors to client
    return res.status(500).json({ 
      message: "An error occurred during login. Please try again." 
    });
  }
};

/**
 * Create JWT token
 * @param {string} id - User UID
 * @returns {string} JWT token
 */
const createJWT = (id, role = 'USER') => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { 
      id,
      role,
      type: 'access',
      iat: Math.floor(Date.now() / 1000) // Issued at
    }, 
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
      issuer: 'flowserve-api',
      audience: 'flowserve-app'
    }
  );
};

/**
 * Verify JWT token middleware
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "No token provided" 
      });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            message: "Token has expired" 
          });
        }
        return res.status(401).json({ 
          message: "Invalid token" 
        });
      }

      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ 
      message: "Token verification failed" 
    });
  }
};

// Optional: Refresh token endpoint
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        message: "Token is required" 
      });
    }

    // Verify old token (even if expired)
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

    // Check if user still exists
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Generate new token
    const newToken = createJWT(user.UID);

    return res.status(200).json({
      success: true,
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({ 
      message: "Invalid token" 
    });
  }
};