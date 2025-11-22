const jwt = require('jsonwebtoken');


function generateAccessToken(payload) {
  const secret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
  const expiry = process.env.JWT_ACCESS_EXPIRY || '30m';
  
  return jwt.sign(payload, secret, { expiresIn: expiry });
}


function generateRefreshToken(payload) {
  const secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  const expiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  
  return jwt.sign(payload, secret, { expiresIn: expiry });
}


function verifyAccessToken(token) {
  try {
    const secret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}


function verifyRefreshToken(token) {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}


function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractTokenFromHeader
};