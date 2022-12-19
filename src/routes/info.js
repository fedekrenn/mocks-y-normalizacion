const express = require('express');
const { Router } = express

const args = require('yargs/yargs')(process.argv.slice(2)).argv

const routerInfo = Router()

routerInfo.get('/info', (req, res) => {

    res.send({
        argumentos: args,
        sistemaOperativo: process.platform,
        numeroDeProcesadores: require('os').cpus().length,
        versionNode: process.version,
        usoDeMemoria: process.memoryUsage().rss,
        pathDeEjecucion: process.execPath,
        processId: process.pid,
        carpetaDelProyecto: process.cwd()
    })
})

module.exports = routerInfo