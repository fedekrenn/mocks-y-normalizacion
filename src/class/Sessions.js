const mongoose = require('mongoose');

const { mongoConfig } = require('../config/config');
const { SessModel } = require('../model/sessModel');
const { createHash } = require('../utils/handlePass');

mongoose.connect(mongoConfig.host, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) console.log(err);
});

class ContenedorSesiones {

    async findUser(user) {
        try {
            const userFound = await SessModel.findOne({ email: user });
            return userFound;
        } catch (err) {
            console.log(err)
        }
    }

    async createUser(user) {
        try {
            const isValidUser = await SessModel.findOne({ email: user.email });

            console.log(isValidUser);

            if (isValidUser) {
                return { err: "El usuario ya existe" }
            } else {
                user.password = createHash(user.password);
                const newUser = new SessModel(user);
                await newUser.save();
                return { message: "Se guardó correctamente el usuario" };
            }
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = ContenedorSesiones;

