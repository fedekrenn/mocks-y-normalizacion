const express = require('express');
const { Router } = express

const routerSesions = Router()

// Logueo

routerSesions.get('/login', async (req, res) => {
    const name = req.query.nameAccess
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