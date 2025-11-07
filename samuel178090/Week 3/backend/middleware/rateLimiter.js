const loginAttempts = new Map();
const generalRequests = new Map();

const rateLimitLogin = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const attempts = loginAttempts.get(ip);
  
  if (now > attempts.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (attempts.count >= maxAttempts) {
    return res.status(429).json({ 
      error: 'Too many login attempts. Try again in 15 minutes.' 
    });
  }

  attempts.count++;
  next();
};

const rateLimitGeneral = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  if (!generalRequests.has(ip)) {
    generalRequests.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const requests = generalRequests.get(ip);
  
  if (now > requests.resetTime) {
    generalRequests.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (requests.count >= maxRequests) {
    return res.status(429).json({ 
      error: 'Too many requests. Try again later.' 
    });
  }

  requests.count++;
  next();
};

module.exports = {
  rateLimitLogin,
  rateLimitGeneral
};