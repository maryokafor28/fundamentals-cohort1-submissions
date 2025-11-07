const xss = require('xss');

// Sanitize user input to prevent XSS
const sanitizeInput = (req, res, next) => {
    try {
        if (req.body && typeof req.body === 'object') {
            for (let key in req.body) {
                if (req.body.hasOwnProperty(key) && typeof req.body[key] === 'string') {
                    req.body[key] = xss(req.body[key]);
                }
            }
        }
        next();
    } catch (error) {
        console.error('Sanitizer error:', error);
        next();
    }
};

module.exports = { sanitizeInput };