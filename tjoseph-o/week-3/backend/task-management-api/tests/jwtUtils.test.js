const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} = require('../utils/jwtUtils');

describe('JWT Access Token', () => {
  const payload = { userId: '123', role: 'user' };

  test('should generate a valid access token', () => {
    const token = generateAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); 
  });

  test('should verify a valid access token', () => {
    const token = generateAccessToken(payload);
    const decoded = verifyAccessToken(token);
    
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  test('should reject an invalid access token', () => {
    const invalidToken = 'invalid.token.here';
    const result = verifyAccessToken(invalidToken);
    
    expect(result).toBeNull();
  });

  test('should reject an expired access token', async () => {
    // Create token with 1ms expiry
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET || 'test-secret',
      { expiresIn: '1ms' }
    );
    
    // Wait for token to expire
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const result = verifyAccessToken(token);
    expect(result).toBeNull();
  });

  test('should reject a token with tampered payload', () => {
    const token = generateAccessToken(payload);
    const parts = token.split('.');
    
    // Tamper with the payload
    parts[1] = Buffer.from(JSON.stringify({ userId: '456', role: 'admin' }))
      .toString('base64')
      .replace(/=/g, '');
    
    const tamperedToken = parts.join('.');
    const result = verifyAccessToken(tamperedToken);
    
    expect(result).toBeNull();
  });
});

describe('JWT Refresh Token', () => {
  const payload = { userId: '123', tokenId: 'abc-123' };

  test('should generate a valid refresh token', () => {
    const token = generateRefreshToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  test('should verify a valid refresh token', () => {
    const token = generateRefreshToken(payload);
    const decoded = verifyRefreshToken(token);
    
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.tokenId).toBe(payload.tokenId);
  });

  test('should reject an invalid refresh token', () => {
    const invalidToken = 'invalid.refresh.token';
    const result = verifyRefreshToken(invalidToken);
    
    expect(result).toBeNull();
  });

  test('should have longer expiry than access token', () => {
    const jwt = require('jsonwebtoken');
    const accessToken = generateAccessToken({ userId: '123' });
    const refreshToken = generateRefreshToken({ userId: '123' });
    
    const accessDecoded = jwt.decode(accessToken);
    const refreshDecoded = jwt.decode(refreshToken);
    
    expect(refreshDecoded.exp).toBeGreaterThan(accessDecoded.exp);
  });
});