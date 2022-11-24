const express = require('express');

const ContenedorProductos = require('./src/class/Products')
const ContenedorMensajes = require('./src/class/Messages')

const routerProductos = require('./src/routes/productos')

const session = require('express-session')


/* --- Instancias  ---- */

const manejadorProductos = new ContenedorProductos()
const manejadorMensajes = new ContenedorMensajes()

const authMiddleware = require('./src/middlewares/auth')

/* ------ Socket.io ------ */

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)



io.on('connection', async socket => {

    console.log('Se conectó un nuevo cliente');

    // Productos
    socket.emit('productos', await manejadorProductos.getRandom());

    // Mensajes
    socket.emit('mensajes', await manejadorMensajes.getAll());

    socket.on('new-message', async mensaje => {

        await manejadorMensajes.save(mensaje)
        io.sockets.emit('mensajes', await manejadorMensajes.getAll());
    })
});



/* --------  App  --------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


/* ------ Session  -------- */

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}))


/* -------  Rutas  -------- */

app.use('/api/productos-test', authMiddleware , routerProductos)

// Logueo

app.get('/login', async (req, res) => {
    const name = req.query.nameAccess
    req.session.nameAccess = name

    res.redirect('/pages/products.html')
})

// Deslogueo

app.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

// Obtener el nombre

app.get('/get-name', async (req, res) => {

    res.send({ nameAccess: req.session.nameAccess })
})

/* -------  Server  -------- */

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${server.address().port}`));
server.on('error', error => console.log(`Error en servidor ${error}`));