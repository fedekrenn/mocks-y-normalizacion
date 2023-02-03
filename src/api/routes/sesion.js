const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { mainRoute, loginRoute, registerRoute, logoutRoute, getNameRoute } = require("../controller/session");

const { Router } = express;
const routerSesions = Router();



// Ruta principal
routerSesions.get("/", authMiddleware, mainRoute);

// Logueo
routerSesions.post("/login", loginRoute);

// Registro
routerSesions.post("/register", registerRoute);

// Deslogueo
routerSesions.get("/logout", logoutRoute);

// Obtener el nombre
routerSesions.get("/get-name", getNameRoute);



module.exports = routerSesions;