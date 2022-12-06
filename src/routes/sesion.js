const express = require('express');
const { Router } = express

const passport = require('passport');

const mainMiddleware = require('../middlewares/main')

const routerSesions = Router()


// Ruta principal
routerSesions.get('/', async (req, res) => {
    // Corregir esto!
    res.redirect('/products')
})

// Ruta de login
routerSesions.post('/login', passport.authenticate('login', {
    successRedirect: '/products',
    failureRedirect: '/pages/login-error.html',
    passReqToCallback: true
})
)

// Ruta de registro
routerSesions.post('/register', passport.authenticate('singup', {
    successRedirect: '/products',
    failureRedirect: '/pages/register-error.html',
    passReqToCallback: true
})
)

// Ruta de productos
routerSesions.get('/products', mainMiddleware, async (req, res) => {
    res.redirect('/pages/products.html')
})


// Deslogueo

routerSesions.get('/logout', (req, res) => {
    req.session.destroy()
    // req.logout()
    res.redirect('/')
})

// Obtener el nombre

routerSesions.get('/get-name', async (req, res) => {

    res.send({ nameAccess: req.session.nameAccess })
})

module.exports = routerSesions