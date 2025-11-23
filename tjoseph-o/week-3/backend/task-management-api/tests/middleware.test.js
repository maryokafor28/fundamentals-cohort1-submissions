require('./setup');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validateRegistration, validateLogin, validateTask } = require('../middleware/validate');
const { generateAccessToken } = require('../utils/jwtUtils');

describe('Authentication Middleware', () => {
  test('should authenticate valid token', () => {
    const token = generateAccessToken({ 
      userId: '123', 
      role: 'user' 
    });

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const res = {};
    const next = jest.fn();

    authenticate(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe('123');
    expect(req.user.role).toBe('user');
    expect(next).toHaveBeenCalled();
  });

  test('should reject request without token', () => {
    const req = {
      headers: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject invalid token', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid.token.here'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject malformed authorization header', () => {
    const req = {
      headers: {
        authorization: 'InvalidFormat token'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Authorization Middleware', () => {
  test('should allow user with correct role', () => {
    const req = {
      user: { userId: '123', role: 'admin' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const middleware = authorize(['admin', 'user']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should reject user with incorrect role', () => {
    const req = {
      user: { userId: '123', role: 'user' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const middleware = authorize(['admin']);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Forbidden')
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject if user not authenticated', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const middleware = authorize(['admin']);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Validation Middleware - Registration', () => {
  test('should pass valid registration data', () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateRegistration(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should reject missing email', () => {
    const req = {
      body: {
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateRegistration(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject invalid email format', () => {
    const req = {
      body: {
        email: 'invalid-email',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateRegistration(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject weak password', () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'weak'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateRegistration(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array)
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Validation Middleware - Task', () => {
  test('should pass valid task data', () => {
    const req = {
      body: {
        title: 'Task Title',
        description: 'Task Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateTask(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should sanitize task inputs', () => {
    const req = {
      body: {
        title: '<script>alert("xss")</script>Clean Title',
        description: 'Clean Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateTask(req, res, next);

    expect(req.body.title).not.toContain('<script>');
    expect(next).toHaveBeenCalled();
  });

  test('should reject empty title', () => {
    const req = {
      body: {
        title: '',
        description: 'Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject title longer than 100 characters', () => {
    const req = {
      body: {
        title: 'a'.repeat(101),
        description: 'Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});