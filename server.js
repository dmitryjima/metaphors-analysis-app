// Require dotenv
require('dotenv').config();

// import the app-level modules
const express = require('express');
const mongoose = require('mongoose');
// Import Node core modules
const fs = require('fs');
const path = require('path');
// Import app-level middleware
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');




    // Instantiate the server app
const app = express();


    // Connect to database
// const DatabaseURI = require('./config/keys').MongoURI;
const DatabaseURI = process.env.MONGO_URI;
const connectionOptions = process.env.NODE_ENV === 'production' ? {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    authSource: "admin"
} : {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}

const connectToMongo = (uri) => {
    mongoose.connect(
            uri, 
            connectionOptions    
        )
        .then(() => console.log('Database connected...'))
        .catch(err => console.log(err))
}
connectToMongo(DatabaseURI);


    // Import all the API-routers and custom app-level middleware
// API Routers
const editionsRouter = require('./api-routes/editions-api/editionsRouter');
const articlesRouter = require('./api-routes/articles-api/articlesRouter');
const metaphorsRouter = require('./api-routes/metaphors-api/metaphorsRouter');
const resultsRouter = require('./api-routes/results-api/resultsRouter');

// Auth admin router 
const authRouter = require('./api-routes/auth-api/authRouter');

// Auth admin middleware
const authMiddleware = require('./middleware/auth');




    // Use app-level middleware
app.use(express.json());
app.use(compression())
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

// logging in development
app.use(logger(':method :url :status :res[content-length] - :response-time ms'));


    // Use API-routers
// API routes
app.use('/api/editions', editionsRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/metaphors', metaphorsRouter)
app.use('/api/results', resultsRouter)

// Auth route
app.use('/api/auth', authRouter);


if (process.env.NODE_ENV === 'production') {
    // Set static folder for the client app
    app.use(express.static(path.join(__dirname, 'client', 'corpora-client-app', 'build')));

    // Handle Customer-App SPA
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'corpora-client-app', 'index.html'));
    })
}

// Use Error-handling middleware
app.use((err, req, res, next) => {
    switch (err.message) {
        default:
            res.status(404).send(err.message);
            break;
    }
});


// Export the app object
module.exports = app;
