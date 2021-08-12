
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')

const roomName = document.getElementById('room-name');
const activeUsers = document.getElementById('users')
const typingLabel = document.getElementById('typing-label');
const inputBox = document.getElementById('msg');

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const socket = io();

const outputRoomName = (room) => {
    roomName.innerHTML = room
}
const outputUsers = (users) => {
    activeUsers.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

socket.emit('joinRoom', { username, room });

//OBTENER USUARIOS EN LA SALA

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})


socket.on('message', message => { //SE ESCUCHA/CAPTURA EL EVENTO message CON SU PARAMETRO message Y SE IMPRIME POR CONSOLA
    outputMessage(message);
    //scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    typingLabel.innerHTML = ``;

}

//ENVIO DE MENSAJE
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.msg.value;
    //Usuario envia el mensaje y se emite el evento con el mensaje hacia el servidor
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.element.mdg.focus();


})

inputBox.addEventListener("keypress", (e) => {
    socket.emit('typingUser')
});

socket.on('typingUserChat', ({ user, room }) => {
    typingLabel.innerHTML = `${user} is typing...`;
})
