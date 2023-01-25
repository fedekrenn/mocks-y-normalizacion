const express = require("express");
const compression = require("compression");
const getInfo = require("../controller/info");
const { Router } = express;
const routerInfo = Router();



routerInfo.get("/info", compression(), getInfo);



module.exports = routerInfo;
