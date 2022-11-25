const express = require('express');

const ContenedorProductos = require('./src/class/Products')
const ContenedorMensajes = require('./src/class/Messages')

const routerProductos = require('./src/routes/productos')
const routerSesions = require('./src/routes/sesion')



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

const session = require('express-session')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(session({

    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://fedekrenn:aE7ETkIwOIZrZW2V@cluster0.r4mk0zv.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),

    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}))

/* -------  Rutas  -------- */

app.use('/api/productos-test', authMiddleware, routerProductos)
app.use('/', routerSesions)


/* -------  Server  -------- */

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${server.address().port}`));
server.on('error', error => console.log(`Error en servidor ${error}`));