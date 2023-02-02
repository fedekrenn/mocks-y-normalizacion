const { loggerError } = require("../../../utils/logger");
const { AuthorDTO, MessageDTO } = require("../messagesDto/MessageDTO");
const normalizeMsgs = require("../../../utils/normalizr");

let instance = null;

class ContenedorMensajes {
  constructor() {
    this.mensajes = [];
  }

  async save(msj) {
    const { author, text } = msj;
    const { id, nombre, apellido, edad, alias, avatar } = author;

    try {
      const author = new AuthorDTO(id, nombre, apellido, edad, alias, avatar);
      const message = new MessageDTO(author, text);

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
