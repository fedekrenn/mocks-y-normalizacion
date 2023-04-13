const messageRepository =
  require("../components/repository/MessagesRepository").getInstance();

/* ------ Socket.io ------ */

const listen = (io) => {
  io.on("connection", async (socket) => {
    console.log("Se conectó un nuevo cliente");

    // Mensajes
    socket.emit("mensajes", await messageRepository.getAll());

    socket.on("new-message", async (msj) => {
      await messageRepository.save(msj);
      io.sockets.emit("mensajes", await messageRepository.getAll());
    });
  });
};

module.exports = { listen };
