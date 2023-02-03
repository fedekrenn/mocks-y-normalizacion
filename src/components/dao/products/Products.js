const { faker } = require("@faker-js/faker");
const { loggerError } = require("../../../utils/logger");
const ProductDTO = require("../../dto/ProductsDTO");

let instance = null;

class ContenedorProductos {
  async getRandom() {
    try {
      const productos = [];

      for (let i = 0; i < 5; i++) {
        const producto = new ProductDTO(
          faker.commerce.productName(),
          faker.commerce.price(),
          faker.image.image()
        );
        productos.push(producto);
      }

      return productos;
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
