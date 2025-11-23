const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'adeomoobaoke';

exports.signToken = (payload) => jwt.sign(payload, SECRET, {expiresIn: '1h'});
exports.verifyToken = (payload) => jwt.verify(payload, SECRET);
