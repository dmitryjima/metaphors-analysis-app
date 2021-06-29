// Part of the authentication chain
// controller - service - db
// Sits on the authRouter '/login' '/logout' etc.

// Import auth services
const auth_services = require('../../lib/services/authService');

const { validationResult } = require('express-validator');

exports.login_controller = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new Error('Invalid credentials');
        }

        const {username, password} = req.body;
        const token = await auth_services.login_service(username, password);
        if(!token) {
            return res
            .status(401)
            .json({status: 'Invalid credentials'})
        }
        res
        .status(201)
        .cookie('auth_token', token.token, {
            signed: true,
            httpOnly: true,
            maxAge: 10 * 60 * 60 * 1000,
            // development only
            secure: process.env.NODE_ENV === 'production' ? true : false
        })
        .json({status: 'OK'})
    } catch (err) {
        return next(err);
    }
}


// Handle checking if token is still valid
exports.check_if_token_valid = async (req, res, next) => {
    const user = req.user;
    console.log(user)
    try {
        if (user) res.json({status: 'OK'});
    } catch (err) {
        return next(err);
    }
}

// Handle Logout
exports.logout_controller = async (req, res, next) => {
    console.log(req.body)
    const token = req.token;
    try {
        if(!token) throw new Error('No token');

        res
        .status(201)
        .cookie('auth_token', '')
        .json({status: 'OK'});
    } catch (err) {
        return next(err);
    }
}
