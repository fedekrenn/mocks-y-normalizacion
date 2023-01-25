const ContenedorProductos = require("../class/Products");
const ContenedorMensajes = require("../class/Messages");

/* --- Instancias  ---- */

const manejadorProductos = new ContenedorProductos();
const manejadorMensajes = new ContenedorMensajes();

/* ------ Socket.io ------ */

const listen = (io) => {
    io.on("connection", async (socket) => {
        console.log("Se conectó un nuevo cliente");

        // Productos
        socket.emit("productos", await manejadorProductos.getRandom());

        // Mensajes
        socket.emit("mensajes", await manejadorMensajes.getAll());

        socket.on("new-message", async (mensaje) => {
            await manejadorMensajes.save(mensaje);
            io.sockets.emit("mensajes", await manejadorMensajes.getAll());
        });
    });
};

module.exports = { listen };