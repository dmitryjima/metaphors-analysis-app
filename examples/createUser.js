// A minimalistic example of creating a user programmatically
// in a local MongoDB instance running on localhost:27017

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const DatabaseURI = 'mongodb://localhost:27017/example-database'

const connectToMongo = (uri) => {
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.info('Database connected...'))
        .catch(err => console.error(err))
}
connectToMongo(DatabaseURI);

async function registerUser(username, password) {
    try {
        const newUser = new User ({
            username,
            passwordHash: password
        });
    
        let salt = await bcrypt.genSalt(10);

        let hash = await bcrypt.hash(newUser.passwordHash, salt)
        
        newUser.passwordHash = hash;

        await newUser.save();

        console.info(newUser);

        process.exit(1)
    } catch (err) {
        console.error(err);
    }
}

registerUser('user', 'password');