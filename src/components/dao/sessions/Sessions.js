const mongoose = require("mongoose");

const { mongoConfig } = require("../../../config/config");
const { SessModel } = require("../../model/sessModel");
const { loggerError } = require("../../../utils/logger");
const { createHash } = require("../../../utils/handlePass");

mongoose.connect(
  mongoConfig.host,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) loggerError.error(err);
  }
);

let instance = null;

class ContenedorSesiones {
  async findUser(user) {
    try {
      const userFound = await SessModel.findOne({ email: user });
      return userFound;
    } catch (err) {
      loggerError.error(err);
    }
  }

  async createUser(user) {
    try {
      const isExistentUser = await SessModel.findOne({ email: user.email });

      if (isExistentUser) {
        loggerError.error(
          `Se intentó crear un usuario que ya existe: ${user.email}`
        );
        return { err: "El usuario ya existe" };
      } else {
        user.password = createHash(user.password);
        const newUser = new SessModel(user);
        await newUser.save();
        return newUser;
      }
    } catch (err) {
      loggerError.error(err);
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new ContenedorSesiones();
    }
    return instance;
  }
}

module.exports = ContenedorSesiones;
