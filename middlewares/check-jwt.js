require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    const privateKey = process.env.JWT_SECRET;

    if (!token) {
        return res.status(401).json({ message: `Unauthorized access: no token` });
    }

    return jwt.verify(token, privateKey, (err, payload) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.admin = payload;

        return next();
    });
};

module.exports = checkJWT;