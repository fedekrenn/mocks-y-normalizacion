const messageFactory = require("../persistence/class/MessagesFactory").getDao();

/* ------ Socket.io ------ */

const listen = (io) => {
  io.on("connection", async (socket) => {
    console.log("Se conectó un nuevo cliente");

    // Mensajes
    socket.emit("mensajes", await messageFactory.getAll());

    socket.on("new-message", async (msj) => {
      await messageFactory.save(msj);
      io.sockets.emit("mensajes", await messageFactory.getAll());
    });
  });
};

module.exports = { listen };
