const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
/* Ver si lo de arriba va acá */



const express = require('express');

const ContenedorProductos = require('./src/class/Products')
const ContenedorMensajes = require('./src/class/Messages')

const routerProductos = require('./src/routes/productos')
const routerSesions = require('./src/routes/sesion')

const authMiddleware = require('./src/middlewares/auth')

const { sessionConfig } = require('./src/config/config');

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


/* -----  passport  ------- */

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {

            if (err) { return done(err); }

            if (!user) return done(null, false, { message: 'Incorrect username.' });

            if (!isValidPassword(password)) return done(null, false, { message: 'Incorrect password.' });

            return done(null, user);
        });
    }
));

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}


/* --------  App  --------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


/* ------ Session  -------- */

const session = require('express-session')

app.use(session(sessionConfig))

/* -------  Rutas  -------- */

app.use('/api/productos-test', authMiddleware, routerProductos)
app.use('/', routerSesions)


/* -------  Server  -------- */

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${server.address().port}`));
server.on('error', error => console.log(`Error en servidor ${error}`));