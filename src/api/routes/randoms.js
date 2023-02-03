const express = require('express');
const childProcess = require('../controller/childProcess')

const { Router } = express
const routerChildProcess = Router()



routerChildProcess.get('/randoms', childProcess)



module.exports = routerChildProcess