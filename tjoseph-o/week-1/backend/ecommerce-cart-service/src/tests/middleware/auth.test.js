const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  let testUser;
  let validToken;

  beforeEach(async () => {
    const userData = global.testUtils.createTestUser();
    testUser = new User(userData);
    await testUser.save();
    validToken = testUser.generateAuthToken();
  });

  // test('should authenticate user with valid token', async () => {
  //   const req = {
  //     header: jest.fn().mockReturnValue(`Bearer ${validToken}`)
  //   };
  //   const res = {};
  //   const next = jest.fn();

  //   await auth(req, res, next);

  //   expect(next).toHaveBeenCalledWith();
  //   expect(req.user).toBeDefined();
  //   expect(req.user.id).toBe(testUser._id.toString());
  //   expect(req.token).toBe(validToken);
  // });



  test('should authenticate user with valid token', async () => {
    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${validToken}`)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
  
    await auth(req, res, next);
  
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(testUser._id.toString());
    expect(req.token).toBe(validToken);
  });

  test('should fail with no token provided', async () => {
    const req = {
      header: jest.fn().mockReturnValue(null)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Access denied. No token provided.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should fail with invalid token format', async () => {
    const req = {
      header: jest.fn().mockReturnValue('InvalidTokenFormat')
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Access denied. Invalid token format.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should fail with invalid token', async () => {
    const req = {
      header: jest.fn().mockReturnValue('Bearer invalid.token.here')
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Access denied. Invalid token.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should fail with expired token', async () => {
    const expiredToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '-1h' }
    );

    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${expiredToken}`)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Access denied. Token expired.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should fail when user no longer exists', async () => {
    
    await User.findByIdAndDelete(testUser._id);

    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${validToken}`)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Access denied. User not found.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should fail when user is inactive', async () => {
    
    testUser.isActive = false;
    await testUser.save();

    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${validToken}`)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Access denied. User account is inactive.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  // test('should accept token from x-auth-token header', async () => {
  //   const req = {
  //     header: jest.fn((headerName) => {
  //       if (headerName === 'Authorization') return null;
  //       if (headerName === 'x-auth-token') return validToken;
  //       return null;
  //     })
  //   };
  //   const res = {};
  //   const next = jest.fn();

  //   await auth(req, res, next);

  //   expect(next).toHaveBeenCalledWith();
  //   expect(req.user).toBeDefined();
  //   expect(req.user.id).toBe(testUser._id.toString());
  // });


  test('should accept token from x-auth-token header', async () => {
    const req = {
      header: jest.fn((headerName) => {
        if (headerName === 'Authorization') return null;
        if (headerName === 'x-auth-token') return validToken;
        return null;
      })
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
  
    await auth(req, res, next);
  
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(testUser._id.toString());
  });
});