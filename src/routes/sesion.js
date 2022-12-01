const express = require('express');
const { Router } = express

const mainMiddleware = require('../middlewares/main')

const routerSesions = Router()


routerSesions.get('/', mainMiddleware, async (req, res) => {
    res.redirect('/pages/products.html')
})
    
// Logueo

routerSesions.post('/login', async (req, res) => {
    const name = req.body.nameAccess
    req.session.nameAccess = name
    res.redirect('/pages/products.html')
})

// Deslogueo

routerSesions.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

// Obtener el nombre

routerSesions.get('/get-name', async (req, res) => {

    res.send({ nameAccess: req.session.nameAccess })
})

module.exports = routerSesions