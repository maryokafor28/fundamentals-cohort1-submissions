import rateLimit from 'express-rate-limit';

// Allows 100 requests per 15 minutes from a single IP
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Allows 10 requests per 15 minutes for sensitive routes
export const strictLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many attempts on a sensitive route, please try again after 15 minutes',
});
