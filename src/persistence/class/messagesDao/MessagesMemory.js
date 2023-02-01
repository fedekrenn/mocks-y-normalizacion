const { loggerError } = require("../../../utils/logger");
const normalizeMsgs = require("../../../utils/normalizr");

let instance = null;

class ContenedorMensajes {
  constructor() {
    this.mensajes = [];
  }

  async save(msj) {
    try {
      this.mensajes.push(msj);
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
