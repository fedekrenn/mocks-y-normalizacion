const { faker } = require('@faker-js/faker');
const { loggerError } = require('../../utils/logger');

let instance = null;

class ContenedorProductos {

    async getRandom() {
        try {
            const productos = []

            for (let i = 0; i < 5; i++) {
                productos.push({
                    title: faker.commerce.productName(),
                    price: faker.commerce.price(),
                    thumbnail: faker.image.image()
                })
            }

            return productos
        } catch (error) {
            loggerError.error(error);
        }
    }

    static getInstance() {
        if (!instance) {
            instance = new ContenedorProductos();
        }
        return instance;
    }
}

module.exports = ContenedorProductos;