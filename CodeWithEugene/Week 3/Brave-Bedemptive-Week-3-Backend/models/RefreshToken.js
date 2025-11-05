const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsedAt: {
    type: Date,
    default: Date.now
  },
  userAgent: {
    type: String,
    maxlength: [500, 'User agent string too long']
  },
  ipAddress: {
    type: String,
    maxlength: [45, 'IP address too long'] // IPv6 can be up to 45 chars
  }
});

// Indexes for better performance
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

// Static method to create a new refresh token
refreshTokenSchema.statics.createToken = async function(userId, userAgent, ipAddress) {
  const token = require('crypto').randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const refreshToken = new this({
    token,
    userId,
    expiresAt,
    userAgent,
    ipAddress
  });
  
  await refreshToken.save();
  return refreshToken;
};

// Static method to find and validate a refresh token
refreshTokenSchema.statics.findAndValidate = async function(token) {
  const refreshToken = await this.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  }).populate('userId');
  
  if (!refreshToken) {
    return null;
  }
  
  // Update last used timestamp
  refreshToken.lastUsedAt = new Date();
  await refreshToken.save();
  
  return refreshToken;
};

// Static method to revoke a specific token
refreshTokenSchema.statics.revokeToken = async function(token) {
  return await this.updateOne(
    { token },
    { isRevoked: true }
  );
};

// Static method to revoke all tokens for a user
refreshTokenSchema.statics.revokeAllUserTokens = async function(userId) {
  return await this.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true }
  );
};

// Static method to clean up expired tokens
refreshTokenSchema.statics.cleanupExpiredTokens = async function() {
  return await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isRevoked: true }
    ]
  });
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
