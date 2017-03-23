const crypto = require('../services/crypto');
const clients = require('../services/clients');
const config = require('../config');

module.exports = (req, res) => {
  if (clients.getclients().length === 0) {
    res.end('Upload succeeded but there are no clients');
  } else {
    const fileBuffer = req.files.image.buffer;
    const filehash = crypto.makeHash(fileBuffer);
    console.log(filehash);
    config.files[filehash] = { name: filehash, parts: [] };

    // encode the filebuffer to base64. we need a string to encrypt
    const buffer = new Buffer(fileBuffer).toString('base64');
    const foo = crypto.encrypt(buffer);

    const parts = crypto.chopString(foo, config.chunksize);

    for (let i = 0; i < parts.length; i += 1) {
      const parthash = crypto.makeHash(parts[i]);
      config.files[filehash].parts.push(parthash);
      config.partstorage[parthash] = { name: parthash, clients: [] };
      clients.pushDataToClients(parts[i], parthash);
    }
    res.end(filehash);
  }
};
