const { z } = require('zod');

// Validation middleware factory
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.errors,
    });
  }
};

// User validation schemas
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Project validation schemas
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(2000),
  techStack: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['idea', 'in-progress', 'completed']).optional(),
  lookingForCollaborators: z.boolean().optional(),
});

const updateProjectSchema = createProjectSchema.partial();

// Comment validation schemas
const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
});

module.exports = {
  validate,
  signupSchema,
  loginSchema,
  createProjectSchema,
  updateProjectSchema,
  createCommentSchema,
};