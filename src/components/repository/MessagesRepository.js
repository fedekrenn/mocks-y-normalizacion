const { AuthorDTO, MessageDTO } = require("../dto/MessagesDTO");
const { loggerError } = require("../../utils/logger");
const normalizeMsgs = require("../../utils/normalizr");

const messageFactory = require("../factory/MessagesFactory");

let instance = null;

class ContenedorMensajes {
  async save(msg) {
    const { author, text } = msg;
    const { id, nombre, apellido, edad, alias, avatar } = author;

    try {
      const author = new AuthorDTO(id, nombre, apellido, edad, alias, avatar);
      const message = new MessageDTO(author, text);

      return await messageFactory.save(message);
    } catch (err) {
      loggerError.error(err);
    }
  }

  async getAll() {
    try {
      return normalizeMsgs(await messageFactory.getAll());
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
