const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    // 401 — no token at all
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided. Use: Authorization: Bearer <token>',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;   // { user_id, role, iat, exp }
        next();
    } catch (err) {
        // 403 — token present but invalid or expired
        return res.status(403).json({
            success: false,
            message: err.name === 'TokenExpiredError'
                ? 'Token has expired. Please log in again.'
                : 'Invalid token.',
        });
    }
}

module.exports = verifyToken;
