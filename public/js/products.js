const socket = io();

const productsContainer = document.getElementById("products-container");
const newMsgForm = document.getElementById("chat-form");
const percentContainer = document.getElementById("percent-container");
const spanName = document.getElementById("span-name");

let nombre = "";

newMsgForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    author: {
      id: nombre,
      nombre: e.target.nameUser.value,
      apellido: e.target.lastNameUser.value,
      edad: parseInt(e.target.ageUser.value),
      alias: e.target.aliasUser.value,
      avatar: e.target.avatarUser.value,
    },
    text: e.target.chatMessage.value,
  };

  socket.emit("new-message", data);

  e.target.chatMessage.value = "";
  e.target.chatMessage.focus();
});

socket.on("mensajes", (data) => {
  const chatContainer = document.getElementById("messages");

  chatContainer.innerHTML = "";

  console.log("Array normalizado: ", data);

  const arrayOfMsg = denormalizeData(data);

  if (arrayOfMsg.length === 0) {
    chatContainer.style.display = "none";
    return;
  } else {
    chatContainer.style.display = "block";
  }

  console.log("Array sin normalización: ", arrayOfMsg);

  arrayOfMsg.reverse();

  // Mostramos por consola la longitud de ambos arrays para ver la diferencia de bytes
  const normalizedLength = JSON.stringify(data).length;
  const desnormalizedLenght = JSON.stringify(arrayOfMsg).length;

  console.log(`Normalized: ${normalizedLength} bytes`);
  console.log(`Desnormalized: ${desnormalizedLenght} bytes`);

  const percent = (
    100 -
    (normalizedLength * 100) / desnormalizedLenght
  ).toFixed(2);

  percent < 0
    ? (percentContainer.innerHTML =
        "<p>Escribe más mensajes para calcular la compresión</p>")
    : (percentContainer.innerHTML = `<p>Porcentaje de compresión: ${percent}%</p>`);

  arrayOfMsg.forEach((message) => {
    const { author, text } = message;
    const { id, nombre, apellido, alias, avatar } = author;

    chatContainer.innerHTML += `
      <div class="message-container">
          <div class="message-container__child">
              <img class="message-avatar" src="${avatar}" alt="${nombre} ${apellido}">
              <div>
                  <p class="message-user">${alias}</p>
                  <p class="message-text">${text}</p>
              </div>
          </div>
          <p class="message-email">${id}</p>
      </div>
  `;
  });
});

async function renderProducts() {
  const data = await fetch("/api/productos-test");

  const products = await data.json();

  if (products.status === 404) return (window.location.href = "/");

  productsContainer.innerHTML = "";

  products.forEach((product) => {
    productsContainer.innerHTML += `
      <tr>
        <td>${product.title}</td>
        <td>$ ${product.price}</td>
        <td><img src="${product.thumbnail}" alt="${product.title}"></td>
      </tr>
    `;
  });
}

function denormalizeData(array) {
  const authorSchema = new normalizr.schema.Entity(
    "author",
    {},
    { idAttribute: "id" }
  );

  const mensajeSchema = new normalizr.schema.Entity(
    "messages",
    {
      author: authorSchema,
    },
    { idAttribute: "text" }
  );

  return normalizr.denormalize(array.result, [mensajeSchema], array.entities);
}

async function getName() {
  const data = await fetch("/get-name");
  const name = await data.json();

  return name.nameAccess;
}

async function logout() {
  Swal.fire({
    icon: "success",
    title: `Te desloguaste correctamente ${nombre}`,
    showConfirmButton: false,
    timer: 2000,
  });

  setInterval(() => {
    window.location.href = "/logout";
  }, 2000);
}

(async function start() {
  spanName.innerHTML = (await getName()) || "";
  nombre = await getName();
  renderProducts();
})();
