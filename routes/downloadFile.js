const clients = require('../services/clients');
const crypto = require('../services/crypto');
const config = require('../config');

const Q = require('q');
const fileType = require('file-type');

module.exports = (req, res) => {
  // cancel any waiting requests
  config.requestPromisesDefer = [];
  config.requestPromises = [];
  config.requestedFileParts = [];

  const fileobj = config.files[req.params.id];
  if (!fileobj) {
    console.log(`requested file ${req.params.id} not found`);
    return res.status(404).end('File not found.');
  }

  if (config.retrievingFile === true) {
    console.log(`Rejected ${req.params.id} because we are busy`);
    return res.status(429).end('Too Many Requests.');
  }
  config.requestedFileParts = fileobj.parts;
  for (let i = 0; i < fileobj.parts.length; i += 1) {
    console.log(`requesting ${fileobj.parts[i]}`);
    // returns promise
    const p = clients.requestPromFromClients(fileobj.parts[i]);
    config.requestPromisesDefer.push(p);
    config.requestPromises.push(p.promise);
  }
  Q.all(config.requestPromises).then((result) => {
    config.retrievingFile = false;

    const foo = result.join('');
    const toReturn = crypto.decrypt(foo);
    const fileBuffer = new Buffer(toReturn, 'base64');
    console.log(`Serving up file ${req.params.id}`);
    res.header('Content-Type', fileType(fileBuffer).mime); // detect mime from Buffer
    res.send(fileBuffer);
  });
};
