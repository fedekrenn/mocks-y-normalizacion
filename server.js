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







// Clusters
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;







/* --- Procesos por Yarg  ---- */

/* Tomando con base el proyecto que vamos realizando, agregar un parámetro
más en la ruta de comando que permita ejecutar al servidor en modo fork o
cluster. Dicho parámetro será 'FORK' en el primer caso y 'CLUSTER' en el
segundo, y de no pasarlo, el servidor iniciará en modo fork. 

const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs.default({ port: 8080 }).alias({ port: 'p' }).argv

const PORT = args.port

COMANDOS: 
tasklist /fi "imagename eq node.exe"
taskkill /pid 13872 /f


*/

const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs.default({ port: 8080, mode: 'fork' }).alias({ port: 'p', mode: 'm' }).argv

const PORT = args.port
const MODE = args.mode





/* --- Instancias  ---- */

const manejadorProductos = new ContenedorProductos()
const manejadorMensajes = new ContenedorMensajes()

/* --- Cluster  ---- */

if (cluster.isMaster) {
    console.log(numCPUs)
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        console.log(`worker ${worker.process.pid} died, ${new Date().toLocaleString()}`);
        cluster.fork();
    });

} else {

    console.log(`Worker ${process.pid} started`);
    console.log("MODE: ", MODE)

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

}