const express = require('express');
const products = require('../controller/products')
const { Router } = express
const routerProductos = Router()



routerProductos.get('/', products)



module.exports = routerProductos