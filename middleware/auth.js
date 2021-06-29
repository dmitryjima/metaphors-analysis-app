// Authorization middleware
// Used to protect private routes for the Admin-App
// Sits on private routes and checks the token from
// the auth headers (stored in cookies on client side)
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const token = req.signedCookies.auth_token;

    console.log('token received...');
    console.log(token)

    if(!token) {
        return res
            .status(401)
            .cookie('auth_token', '')
            .json({msg: 'No token, authorization denied'});
    }

    try {

        await jwt.verify(token.toString(), jwtSecret, (err, decoded) => {
            if(err) {
                console.log('error is here', err);
                res
                    .status(401)
                    .cookie('auth_token', '')
                    .json({ msg: 'Token is not valid' });
            }
            else {
                req.user = decoded;
                req.token = token;
                next();
            }
        })
        
    } catch (err) {
        console.error('Something broke within auth middleware');
        res.status(500).json({msg: 'Server error'});
    }
}
