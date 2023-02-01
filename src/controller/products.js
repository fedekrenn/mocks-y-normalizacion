const ContenedorProductos = require('../persistence/class/Products')
const manejadorProductos = ContenedorProductos.getInstance()

const products = async (req, res) => {
    const productos = await manejadorProductos.getRandom()

    res.json(productos)
}

module.exports = products