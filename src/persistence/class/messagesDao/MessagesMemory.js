const { loggerError } = require("../../../utils/logger");
const { AuthorDTO, MessageDTO } = require("../messagesDto/MessageDTO");
const normalizeMsgs = require("../../../utils/normalizr");

let instance = null;

class ContenedorMensajes {
  constructor() {
    this.mensajes = [];
  }

  async save(msj) {
    try {
      const author = new AuthorDTO(
        msj.author.id,
        msj.author.nombre,
        msj.author.apellido,
        msj.author.edad,
        msj.author.alias,
        msj.author.avatar
      );
      const message = new MessageDTO(author, msj.text);

      this.mensajes.push(message);
      return { message: "Se guardó correctamente el mensaje" };
    } catch (err) {
      loggerError.error(err);
    }
  }

  async getAll() {
    try {
      return normalizeMsgs(this.mensajes);
    } catch (error) {
      loggerError.error(error);
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new ContenedorMensajes();
    }
    return instance;
  }
}

module.exports = ContenedorMensajes;
