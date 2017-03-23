const crypto = require('../services/crypto');
const sniper = require('../services/clients');
const config = require('../config');

module.exports = (req, res) => {
  // const hash = crypto.makeHash(req.files.image.buffer);
  // config.files[hash] = req.files.image.buffer;
  // res.send(hash);
  // if (req.body.pass === 'supersecurepassword' || true) {
  if (sniper.getclients().length === 0) {
    res.end('Upload succeeded but there are no clients');
  } else {
    const fileBuffer = req.files.image.buffer;
    const filehash = crypto.makeHash(fileBuffer);
    console.log(filehash);
    config.files[filehash] = { name: filehash, parts: [] };

    // encode the filebuffer to base64. this makes the encryption part actually work.
    const buffer = new Buffer(fileBuffer).toString('base64');
    const foo = crypto.encrypt(buffer);

    // at this point foo can be chopped up and serverd to the botnet
    const parts = crypto.chopString(foo, config.chunksize); // parts are 100kb like this

    // save the first chunk to the server for testing of the filesize
    console.log(parts.length);

    for (let i = 0; i < parts.length; i += 1) {
      const parthash = crypto.makeHash(parts[i]);
      config.files[filehash].parts.push(parthash);
      config.partstorage[parthash] = { name: parthash, clients: [] };
      sniper.pushDataToClients(parts[i], parthash);
    }
    res.end(filehash);
  }
};
