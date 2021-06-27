// Import required modules
const app = require('../server.js');
const http = require('http');

// Define required Functions
// normalizePort()
const normalizePort = (val) => {
    let port = parseInt(val, 10);

    if(isNaN(port)) {
        // named pipe
        return val;
    }

    if(port >= 0) {
        // port number
        return port;
    }

    return false;
}

// onError() - 'error' event listner 
onError = (error) => {
    if(error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof PORT === 'string'
      ? 'Pipe ' + PORT
      : 'Port ' + PORT;

    // Handlespecidif listen errors with friendly messages
    switch(error.code) {
        case 'EACCESS':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// onListening() - 'listening' event listener
onListening = () => {
    let addr = Server.address();
    let bind = typeof addr === 'string' 
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log(`Server started on ${bind}`);
}

// Get the port from environment and store in Express
const PORT = normalizePort(process.env.PORT || '5000');

// Create HTTP server
const Server = http.createServer(app);


// Listen on provided port, listen for events
Server.listen(PORT);
Server.on('error', onError);
Server.on('listening', onListening);
