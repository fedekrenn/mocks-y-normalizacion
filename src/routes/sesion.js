const express = require('express');
const { Router } = express

const passport = require('passport');

const mainMiddleware = require('../middlewares/main')

const ContenedorSesiones = require('../class/Sessions');

const manejadorSesiones = new ContenedorSesiones()

const routerSesions = Router()


// Ruta principal
routerSesions.get('/', mainMiddleware, async (req, res) => {
    res.redirect('/pages/products.html')
})

// Ruta de login
routerSesions.post('/login', passport.authenticate('login', {
        successRedirect: '/pages/products.html',
        failureRedirect: '/pages/login-error.html',
        passReqToCallback: true
    })
)

// Ruta de registro
routerSesions.post('/register', async (req, res) => {

    const { email, password } = req.body

    const user = await manejadorSesiones.createUser({ email, password })

    if (user.err) {
        // Acá tengo que crear una page en el front para error en la creación de usuario y redirijirlo
        res.status(400).json({ error: user.err })
    } else {
        res.redirect('/pages/products.html')
    }
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