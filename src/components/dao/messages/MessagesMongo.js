const mongoose = require("mongoose");
const { mongoConfig } = require("../../../config/config");
const { MensajesModel } = require("../../model/msgModel");
const { loggerError } = require("../../../utils/logger");

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
  async save(msg) {
    try {
      const newMsg = new MensajesModel(msg);
      await newMsg.save();

      return { message: "Se guardó correctamente el mensaje" };
    } catch (err) {
      loggerError.error(err);
    }
  }

  async getAll() {
    try {
      return await MensajesModel.find();
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
