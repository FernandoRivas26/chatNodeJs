
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const socket = io();

socket.emit('joinRoom', { username, room });

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

socket.on()