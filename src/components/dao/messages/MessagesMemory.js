const { loggerError } = require("../../../utils/logger");

let instance = null;

class ContenedorMensajes {
  constructor() {
    this.mensajes = [];
  }

  async save(msg) {
    try {
      this.mensajes.push(msg);
      return { message: "Se guardó correctamente el mensaje" };
    } catch (err) {
      loggerError.error(err);
    }
  }

  async getAll() {
    try {
      return this.mensajes;
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
