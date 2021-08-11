const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const http = require('http');
const socketio = require('socket.io')


const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, 'public')));

//SOCKETS EVENTS

io.on('connection', socket => {
    console.log("New user connected")
})


server.listen(PORT, () => {
    console.log("Server On", PORT)
})