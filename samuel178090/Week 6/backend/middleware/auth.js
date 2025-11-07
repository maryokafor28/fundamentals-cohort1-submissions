import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: 'Authentication required',
                message: 'No token provided'
            });
        }

        if (!process.env.JWT_KEY) {
            console.error('JWT_KEY environment variable not set');
            return res.status(500).json({ 
                error: 'Server configuration error' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        
        if (!decoded.id) {
            return res.status(403).json({ 
                error: 'Invalid token format' 
            });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role || 'USER',
            username: decoded.username
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired',
                message: 'Please login again'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ 
                error: 'Invalid token',
                message: 'Authentication failed'
            });
        }
        
        console.error('Authentication error:', error);
        return res.status(500).json({ 
            error: 'Authentication service error' 
        });
    }
}

export function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Authentication required' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Insufficient permissions',
                message: 'Access denied for your role'
            });
        }

        next();
    };
}