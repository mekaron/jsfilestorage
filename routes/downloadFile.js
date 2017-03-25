const clients = require('../services/clients');
const crypto = require('../services/crypto');
const config = require('../config');

const Q = require('q');
const fileType = require('file-type');

module.exports = (req, res) => {
  // reset globals
  config.deferred_references = [];
  config.proms = [];
  config.tempfile_index_reference = [];

  const fileobj = config.files[req.params.id];
  if (!fileobj) {
    console.log(`requested file ${req.params.id} not found`);
    res.status(404).end('File not found.');
  } else {
    config.tempfile_index_reference = fileobj.parts;
    for (let i = 0; i < fileobj.parts.length; i += 1) {
      console.log(`requesting ${fileobj.parts[i]}`);
      // returns promise
      const p = clients.requestPromFromClients(fileobj.parts[i]);
      config.deferred_references.push(p);
      config.proms.push(p.promise);
    }
    Q.all(config.proms).then((result) => {
      const foo = result.join('');
      const toReturn = crypto.decrypt(foo);
      const write = new Buffer(toReturn, 'base64');
      console.log(`Serving up file ${req.params.id}`);
      res.header('Content-Type', fileType(write).mime);
      res.send(write);
    });
  }
};
