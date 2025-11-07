const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'&]/g, (match) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[match];
  }).trim();
};

const validateRegistration = (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and number' });
  }

  if (role && !['USER', 'ADMIN'].includes(role.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  req.body.email = sanitizeString(email.toLowerCase());
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  req.body.email = sanitizeString(email.toLowerCase());
  next();
};

const validateTask = (req, res, next) => {
  const { title, description } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (title.length > 200) {
    return res.status(400).json({ error: 'Title must be less than 200 characters' });
  }

  if (description && description.length > 1000) {
    return res.status(400).json({ error: 'Description must be less than 1000 characters' });
  }

  req.body.title = sanitizeString(title);
  if (description) {
    req.body.description = sanitizeString(description);
  }

  next();
};

const validateSearch = (req, res, next) => {
  const { query, page, limit } = req.body;

  if (query && typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query must be a string' });
  }

  if (page && (!Number.isInteger(parseInt(page)) || parseInt(page) < 1)) {
    return res.status(400).json({ error: 'Page must be a positive integer' });
  }

  if (limit && (!Number.isInteger(parseInt(limit)) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({ error: 'Limit must be between 1 and 100' });
  }

  if (query) {
    req.body.query = sanitizeString(query);
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateTask,
  validateSearch
};