const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Send token in cookie and response
exports.sendTokenResponse = (user, statusCode, res) => {
  const token = this.generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,  // Can't access via JavaScript (XSS protection)
    secure: process.env.NODE_ENV === 'production',  // HTTPS only
    sameSite: 'strict',  // CSRF protection
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      status: 'success',
      token,
      data: { user },
    });
};  