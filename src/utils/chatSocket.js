const ContenedorMensajes = require("../persistence/class/Messages");
const manejadorMensajes = ContenedorMensajes.getInstance();

/* ------ Socket.io ------ */

const listen = (io) => {
    io.on("connection", async (socket) => {
        console.log("Se conectó un nuevo cliente");

        // Mensajes
        socket.emit("mensajes", await manejadorMensajes.getAll());

        socket.on("new-message", async (mensaje) => {
            await manejadorMensajes.save(mensaje);
            io.sockets.emit("mensajes", await manejadorMensajes.getAll());
        });
    });
};

module.exports = { listen };