const { fork } = require("child_process");

const childProcess = async (req, res) => {
  const q = req.query.cant || 100000000;
  const child = fork("./src/utils/randomNumbers.js");

  child.send({ cantidad: q });

  child.on("message", (message) => {
    res.send(message);
  });
};

module.exports = childProcess;
