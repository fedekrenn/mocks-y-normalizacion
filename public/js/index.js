const socket = io();

const productsContainer = document.getElementById('products-container');
const newMsgForm = document.getElementById('chat-form');


// Formulario de mensajes

newMsgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        author: {
            id: e.target.chatUserName.value,
            nombre: e.target.nameUser.value,
            apellido: e.target.lastNameUser.value,
            edad: parseInt(e.target.ageUser.value),
            alias: e.target.aliasUser.value,
            avatar: e.target.avatarUser.value
        },
        text: e.target.chatMessage.value
    }

    socket.emit('new-message', data);

    newMsgForm.reset();

    // Hacer foco en el input de mensaje
    e.target.chatMessage.focus();
});


socket.on('mensajes', (data) => {
    const chatContainer = document.getElementById('messages');

    chatContainer.innerHTML = '';

    if (data.length === 0) {
        chatContainer.style.display = 'none';
    } else {
        chatContainer.style.display = 'block';
    }

    data.forEach(message => {

        const { author, text } = message;
        const { id, nombre, apellido, edad, alias, avatar } = author;

        chatContainer.innerHTML += `
            <div class="message-container">
                <p class="message-user">${alias}</p>
                <p class="message-text">${text}</p>
            </div>
        `;
    });
});

async function renderProducts() {

    const data = await fetch('/api/productos-test');

    const products = await data.json();

    productsContainer.innerHTML = '';

    products.forEach(product => {
        productsContainer.innerHTML += `
            <tr>
                <td>${product.title}</td>
                <td>$ ${product.price}</td>
                <td><img src="${product.thumbnail}" alt="${product.title}"></td>
            </tr>
        `;
    });
}

renderProducts();