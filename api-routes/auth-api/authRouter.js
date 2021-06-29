// auth API
// used to login to the Admin-App
const { check } = require('express-validator');

const authMiddleware = require('../../middleware/auth');

// Import modules
const express = require('express');
const router = express.Router();

// Import controller modules
const auth_controller = require('../../controllers/auth-controllers/authController');

// @Login router
// @POST retreive token
router.post('/login', 
    check('username').isAlpha(),
    check('password').isAlphanumeric().isLength({ min: 3 }),
    auth_controller.login_controller
);


// @Check if token valid
router.post('/check_token', authMiddleware, auth_controller.check_if_token_valid);

// @Logout
router.post('/logout', authMiddleware, auth_controller.logout_controller);


module.exports = router;