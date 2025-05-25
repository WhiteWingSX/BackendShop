const app = require('./src/app');
const http = require('http');
const {Server} = require('socket.io');
const console = require("node:console");
const configureSocket = require("./src/socket.io");

// Web-Socket Config SERVER

const server = http.createServer(app);

// Web-socket Config SOCKET
const io = new Server(server);
app.set('io', io);

configureSocket(io)

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
