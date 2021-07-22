const router = require("express").Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const checkAuthFields = require('../middlewares/check-fields');
const Admin = require('../models/admin');

const isProduction = process.env.NODE_ENV === 'production'

// auth login (check email + password)
router.post('/', checkAuthFields, (req, res) => {
    const { email, password } = req.body;
    let user = null;

    Admin.findByEmail(email).then((admin) => {
        console.log(admin);
        if (!admin) {
            return Promise.reject(new Error('ADMIN_NOT_EXISTING'));
        }
        user = admin;
        return Admin.verifyPassword(password, admin.password)
    })
    .then((isValidPassword) => {
        if (!isValidPassword) {
            res.status(400).json({ message: `Unauthorized access: invalid password` });
        } else {
            /* res.status(200).json(user); */
            const { id, email } = user;
            const payload = { id, email };
            const privateKey = process.env.JWT_SECRET

            jwt.sign({ payload }, privateKey, (jwterr, token) => {
                if (jwterr) {
                    return res.status(500).json({ message: `Error while attempting login: ${jwterr.message}`});
                } 
                const options = {
                    httpOnly: true,
                    expiresIn: '1h',
                    secure: isProduction
                }
                res.cookie('jwt', token, options);
                res.status(200).json({ payload });
            });
        }
    })
    .catch((err) => {
        console.error(err.message);
        if (err.message === 'ADMIN_NOT_EXISTING') {
            res.status(401).json({ message: `Unauthorized access: user not existing` });
        } else {
            res.status(500).json({ message: `Error while attempting login: ${err.message}`})
        }
    });
});


module.exports = router;