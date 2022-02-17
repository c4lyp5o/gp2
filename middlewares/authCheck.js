const jwt = require('jsonwebtoken');

const authCheck = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Please log in' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, username: payload.username, negeri: payload.negeri, daerah: payload.daerah, kp: payload.kp };
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Please log in' });
    }
}

module.exports = authCheck;