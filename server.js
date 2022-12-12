/* --- Importaciones  ---- */

const express = require('express');

const ContenedorProductos = require('./src/class/Products')
const ContenedorMensajes = require('./src/class/Messages')

const routerProductos = require('./src/routes/productos')
const routerSesions = require('./src/routes/sesion')
const routerInfo = require('./src/routes/info')
const routerChildProcess = require('./src/routes/childProcess')

const sessionMiddleware = require('./src/middlewares/session')

const { sessionConfig } = require('./src/config/config');

const passport = require('./src/utils/passport');

/* --- Procesos por Yarg  ---- */

const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs.default({port: 8080}).alias({port: 'p'}).argv

const PORT = args.port


/* --- Instancias  ---- */

const manejadorProductos = new ContenedorProductos()
const manejadorMensajes = new ContenedorMensajes()



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

app.use(session(sessionConfig))



/* -----  passport  ------- */

app.use(passport.initialize());
app.use(passport.session());




/* -------  Rutas  -------- */

app.use('/api/productos-test', sessionMiddleware, routerProductos)
app.use('/', routerSesions)
app.use('/', routerInfo)
app.use('/api', routerChildProcess)



/* -------  Server  -------- */


const server = httpServer.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${server.address().port}`));
server.on('error', error => console.log(`Error en servidor ${error}`));