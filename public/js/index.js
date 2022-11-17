const socket = io();

const formProd = document.getElementById('product-form');
const formChat = document.getElementById('chat-form');
const productsContainer = document.getElementById('products-container');

// Manejo de envío de formularios

formProd.addEventListener('submit', (e) => {

    e.preventDefault();

    // Control de mensajes vacíos
    if (e.target.title.value === '' || e.target.price.value === '' || e.target.thumbnail.value === '') {
        return alert('Todos los campos son obligatorios');
    }

    const data = {
        title: e.target.title.value,
        price: e.target.price.value,
        thumbnail: e.target.thumbnail.value
    }

    socket.emit('update', data);

    e.target.price.value = '';
    e.target.title.value = '';
    e.target.thumbnail.value = '';

});

formChat.addEventListener('submit', (e) => {
    e.preventDefault();

    // Control de mensajes vacíos
    if (e.target.chatUserName.value == '' || e.target.chatTextMsg.value == '' || e.target.chatColor.value == '') {
        return alert('Debe completar todos los campos');
    }

    const data = {
        email: e.target.chatUserName.value,
        message: e.target.chatTextMsg.value,
        color: e.target.chatColor.value
    }

    socket.emit('new-message', data);

    e.target.chatTextMsg.value = '';

    // Desabilitar los input
    e.target.chatUserName.disabled = true;
    e.target.chatColor.disabled = true;

    // Hacer foco en el input de mensaje
    e.target.chatTextMsg.focus();
});



// Manejador de eventos para el socket - Para el desafío de la clase 22 se comenta así se trabaja con faker

// socket.on('productos', (data) => {

//     productsContainer.innerHTML = '';

//     data.forEach(product => {
//         productsContainer.innerHTML += `
//             <tr>
//                 <td>${product.title}</td>
//                 <td>$ ${product.price}</td>
//                 <td><img src="${product.thumbnail}" alt="${product.title}"></td>
//             </tr>
//         `;
//     });
// });

socket.on('mensajes', (data) => {
    const chatContainer = document.getElementById('messages');

    chatContainer.innerHTML = '';

    if (data.length === 0) {
        chatContainer.style.display = 'none';
    } else {
        chatContainer.style.display = 'block';
    }

    // Ordenar por id descendente para lograr que los mensajes se muestren en orden cronologico descendente
    data.sort((a, b) => b.id - a.id);

    data.forEach(message => {
        chatContainer.innerHTML += `
            <div class="message-container">
                <p class="message-user" style="color: ${message.color}">${message.email}</p>
                <p class="message-text">${message.message}</p>
                <p class="message-date">${message.date}</p>
            </div>
        `;
    });
});

async function renderProducts() {

    const data = await fetch('http://localhost:8080/api/productos-test');

    const products = await data.json();

    console.log(products);

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