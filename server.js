const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const http = require('http');
const socketio = require('socket.io')
const formatMessage = require('./utils/messages');
const { getCurrentUser, userJoin, userLeave, getRoomUsers } = require('./utils/users');

const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat Bot'

//SOCKETS EVENTS

io.on('connection', socket => {  //CUANDO UN USUARIO SE CONECTA EMITE EL EVENTO connection


    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)
        socket.emit('message', formatMessage(botName, 'WELCOME!')); //SE EMITE EL EVENTO message POR DEFECTO AL INGRESAR, ESTE EVENTO ES CAPTURADO POR EL FRONT

        //CUANDO UN USUARIO SE CONECTA
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat.`)); //EMITE UN EVENTO A TODOS LOS USUARIOS EXCEPTO AL USUARIO QUE LO EMITE

        //USUARIOS EN LA SALA
        io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) })

    });

    //CUANDO UN USUARIO SE DESCONECTA
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} left the room`));
            //USUARIOS EN LA SALA
            io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) })
        }
    })
    //io.emit(); //EMITE UN EVENTO A TODOS LOS USUARIOS


    //ESCUCHA POR EVENTO DE UN MENSAJE DEL CHAT
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        if (user?.room) {
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        }

    })

    socket.on('typingUser', () => {
        const user = getCurrentUser(socket.id);
        if (user?.room) {
            socket.broadcast.to(user.room).emit('typingUserChat', { user: user.username, room: user.room })
        }
    });


})


server.listen(PORT, () => {
    console.log("Server On", PORT)
})