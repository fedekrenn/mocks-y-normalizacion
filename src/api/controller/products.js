const ContenedorProductos = require('../../components/dao/products/Products')
const manejadorProductos = ContenedorProductos.getInstance()

const products = async (req, res) => {
    const productos = await manejadorProductos.getRandom()

    res.json(productos)
}

module.exports = products