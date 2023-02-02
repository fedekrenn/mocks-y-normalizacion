const mongoose = require("mongoose");
const { mongoConfig } = require("../../../config/config");
const { MensajesModel } = require("../../model/msgModel");
const { loggerError } = require("../../../utils/logger");
const { AuthorDTO, MessageDTO } = require("../messagesDto/MessageDTO");
const normalizeMsgs = require("../../../utils/normalizr");

mongoose.connect(
  mongoConfig.host,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.log(err);
  }
);

let instance = null;

class ContenedorMensajes {
  async save(msj) {
    const { author, text } = msj;
    const { id, nombre, apellido, edad, alias, avatar } = author;

    try {
      const author = new AuthorDTO(id, nombre, apellido, edad, alias, avatar);
      const message = new MessageDTO(author, text);

      const newMsg = new MensajesModel(message);
      await newMsg.save();

      return { message: "Se guardó correctamente el mensaje" };
    } catch (err) {
      loggerError.error(err);
    }
  }

  async getAll() {
    try {
      const mensajes = await MensajesModel.find();

      return normalizeMsgs(mensajes);
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
