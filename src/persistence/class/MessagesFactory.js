const { logger } = require("../../utils/logger");
const yargs = require("yargs/yargs")(process.argv.slice(2));
const args = yargs
  .default({ persitence: "MONGO" })
  .alias({ persitence: "o" }).argv;

const PERSISTENCE = args.persitence.toUpperCase();
console.log("Persistence: ", PERSISTENCE);

let handleMessages;

switch (PERSISTENCE) {
  case "MONGO":
    const ContenedorMensajesMongo = require("./messagesDao/MessagesMongo");
    handleMessages = ContenedorMensajesMongo.getInstance();

    logger.info("Persistence: Mongo");
    break;

  case "MEMORY":
    const ContenedorMensajesMemory = require("./messagesDao/MessagesMemory");
    handleMessages = ContenedorMensajesMemory.getInstance();

    logger.info("Persistence: Memory");
    break;

  default:
    logger.error("Persistence: Error, persistence not found");
    break;
}

class MessagesFactory {
  static getDao() {
    return handleMessages;
  }
}

module.exports = MessagesFactory;
