const jwtUtil = require('../../utils/jwt');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({error: 'No token provided'});

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwtUtil.verifyToken(token);
        req.user = decoded;
        next();
    }   catch {
        res.status(401).json({error: 'Invalid or expired token'});
    }
};