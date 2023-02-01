/* ---- Imports  ---- */
const express = require("express");

const routerProductos = require("./src/routes/productos");
const routerSesions = require("./src/routes/sesion");
const routerInfo = require("./src/routes/info");
const routerRandoms = require("./src/routes/randoms");
const passport = require("./src/utils/passport");
const chat = require("./src/utils/chatSocket");

const sessionMiddleware = require("./src/middlewares/session");

const { sessionConfig } = require("./src/config/config");
const { loggerWarn } = require("./src/utils/logger");

/* ---- Procesos por Yarg  ---- */

const yargs = require("yargs/yargs")(process.argv.slice(2));
const args = yargs
  .default({ port: 8080, mode: "fork" })
  .alias({ port: "p", mode: "m" }).argv;

const PORT = process.env.PORT || args.port;
const MODE = args.mode.toUpperCase();

/* ---- Cluster  ---- */

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (MODE === "CLUSTER" && cluster.isMaster) {
  console.log("Número de CPUs: ", numCPUs);
  console.log("Modo: ", MODE);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(
      `worker ${worker.process.pid} died, ${new Date().toLocaleString()}`
    );
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started in mode ${MODE}`);

  /* ------ Socket.io ------ */

  const { Server: HttpServer } = require("http");
  const { Server: Socket } = require("socket.io");

  const app = express();
  const httpServer = new HttpServer(app);
  const io = new Socket(httpServer);

  chat.listen(io);

  /* --------  App  --------- */

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  /* ------ Session  -------- */

  const session = require("express-session");

  app.use(session(sessionConfig));

  /* -----  Passport  ------- */

  app.use(passport.initialize());
  app.use(passport.session());

  /* -------  Rutas  -------- */

  app.use("/api/productos-test", sessionMiddleware, routerProductos);
  app.use("/", routerSesions);
  app.use("/", routerInfo);
  app.use("/api", routerRandoms);

  app.get("*", (req, res) => {
    loggerWarn.warn(
      `Ruta: ${req.originalUrl} - Método: ${req.method} - No implementada`
    );

    res.status(404).send({
      error: -2,
      descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`,
    });
  });

  /* -------  Server  -------- */

  const server = httpServer.listen(PORT, () =>
    console.log(
      `Servidor http escuchando en el puerto ${server.address().port}`
    )
  );
  server.on("error", (error) => console.log(`Error en servidor ${error}`));
}
