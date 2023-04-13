# ⌨ Websocket v2 - Pro

Versión más avanzada del repositorio de productos / chat en vivo, que podrás encontrar en el siguiente link: [Socket.io](https://github.com/fedekrenn/socket.io)

## 📝 Detalle

Se trata de una versión más avanzada del repositorio de productos / chat en vivo. En esta versión se implementa un sistema de login y registro de usuarios (se usa passport y passport local, encriptando la pass con Bcrypt). Además se reemplaza la generación de productos manual por productos random que se generan con la librería Faker. La persistencia pasa a ser en MongoDB en vez de MySQL. Se toman las variables de la línea de comandos por yargs. También se envía la info al front-end comprimida y normalizada para optimizar la transferencia de datos. Por último, se utiliza Nginx como proxy inverso para el servidor de Node.js.

## ⌨🖱 Instalación

- Para correr la app puedes:

1. Clonar el repositorio y utilizarlo de manera local
2. Generar un archivo .env con las variables de entorno necesarias para correr la app

```
MONGO_URL
```

3. Correr el comando npm install para instalar las dependencias

4. Correr el comando npm start para iniciar el servidor o npm run dev para iniciar el servidor con nodemon en modo desarrollo

## 🖥️ Comandos

- `npm start` Inicia el servidor con los valores por defecto (puerto 8080 y fork)
- `npm start -- -p 3000` Inicia el servidor en el puerto 3000, se puede seleccionar cualquiera deseado
- `npm start -- -m cluster` Inicia el servidor en modo cluster para aprovechar los cores de la CPU del server
- `npm run dev` Inicia el servidor con nodemon en modo desarrollo

## 📊 Benchmark

Se utilizó la herramienta Autocannon para realizar el benchmark de la app. Se realizaron 1000 requests en10 conexiones simultáneas, tanto en modo fork como en modo cluster. Los resultados se encuentran en lacarpeta benchmark.

## 🖥️ Ruta alternativa

En la ruta /info se puede ver la info con la que está corriendo el servidor, como el puerto, el modo, la cantidad de procesos, los comandos pasados por línea de comandos, el process id, etc. Por ejemplo:

```
{
  "argumentos": {
    "_": [

    ],
    "p": 8083,
    "m": "cluster",
    "$0": "server.js"
  },
  "sistemaOperativo": "win32",
  "numeroDeProcesadores": 4,
  "versionNode": "v18.12.0",
  "usoDeMemoria": 137330688,
  "pathDeEjecucion": "C:\\Program Files\\nodejs\\node.exe",
  "processId": 17288
}
```

## 📚 Tecnologías utilizadas

- Node.js
- Express
- Socket.io
- MongoDB
- Mongoose
- Faker
- Autocannon
- Bcrypt
- Compression
- Dotenv
- Log4js
- Normalizr
- Passport
- Passport-local
- Yargs
- Nginx

<br>
<br>

## 🙋‍♂️ Hola, Soy Federico Krenn

:nerd_face: Desarrollador web Fullstack
<br>
👨‍🎓 Realizando la Tecnicatura en Desarrollo Web en ISPC y Tecnicatura en Software Libre en la UNL
<br>
📫 Conectemos en Linkedin: https://www.linkedin.com/in/fkrenn/
