// Part of the authentication chain
// controller - service - db
// connects the db to check User's credentials
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET;

exports.login_service = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({username: username}).exec();
            if(!user) {
                throw new Error('User does no exist');
            }
    
            const isMatch = await bcrypt.compare(password, user.passwordHash);

            if(!isMatch) {
                throw new Error('Invalid credentials');
            } 
            
            const payload = {
                id: user.id,
                role: user.role,
                username: user.username
            }

            jwt.sign(
                payload,
                jwtSecret,
                {expiresIn: process.env.ADMIN_JWT_EXP_TIME},
                (err, token) => {
                    if(err) throw err;
                    console.log(token)
                    resolve({token});
                }
            );
            
        } catch (err) {
            return reject(err);
        }
    });
}