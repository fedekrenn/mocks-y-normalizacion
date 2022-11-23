const express = require('express');

const ContenedorProductos = require('./src/class/Products')
const ContenedorMensajes = require('./src/class/Messages')

const routerProductos = require('./src/routes/productos')

const session = require('express-session')


/* --- Instancias  ---- */

const manejadorProductos = new ContenedorProductos()
const manejadorMensajes = new ContenedorMensajes()


/* ------ Socket.io ------ */

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io');
const { response } = require('express');

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
    resave: true,
    saveUninitialized: true
}))


/* -------  Rutas  -------- */

app.use('/api/productos-test', routerProductos)

app.get('/login', async (req, res) => {
    const name = req.query.nameAccess
    req.session.nameAccess = name

    res.redirect('/pages/products.html')
})


/* -------  Server  -------- */

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${server.address().port}`));
server.on('error', error => console.log(`Error en servidor ${error}`));