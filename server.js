const express = require('express');

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorProductos = require('./src/class/Products')
const ContenedorMensajes = require('./src/class/Messages')

/* --- Instancias  ---- */

const manejadorProductos = new ContenedorProductos()
const manejadorMensajes = new ContenedorMensajes()


/* ------ Socket.io ------ */

const app = express();
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)


// Faker

app.get('/api/productos-test', async (req, res) => {

    const productos = await manejadorProductos.getRandom()

    res.json(productos)
})

// Configuración de socket

io.on('connection', async socket => {
    
    console.log('Se conectó un nuevo cliente');

    // Productos
    socket.emit('productos', await manejadorProductos.getRandom());

    // Se comenta ya que para este desafío no necesitamos guardar productos

    // socket.on('update', async producto => {
    //     await manejadorProductos.save(producto);
    //     io.sockets.emit('productos', await manejadorProductos.getAll());
    // })


    // Mensajes
    socket.emit('mensajes', await manejadorMensajes.getAll());

    socket.on('new-message', async mensaje => {

        await manejadorMensajes.save(mensaje)
        io.sockets.emit('mensajes', await manejadorMensajes.getAll());
    })

});

/* ----------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${server.address().port}`));

server.on('error', error => console.log(`Error en servidor ${error}`));