const crypto = module.require('crypto');
const uuid = require('node-uuid');

module.exports = {
  encrypt,
  makeUUID,
  decrypt,
  makeHash,
  chopString,
};

function encrypt(buffer) {
  const cipher = crypto.createCipher('aes192', 'pass');
  const msg = [];
  msg.push(cipher.update(buffer, 'binary', 'base64'));
  msg.push(cipher.final('base64'));
  const foo = msg.join('');
  return foo;
}

function makeUUID() {
  return uuid.v4().replace('-', '');
}

function decrypt(foo) {
  const decipher = crypto.createDecipher('aes192', 'pass');
  const msg2 = [];
  msg2.push(decipher.update(foo, 'base64', 'binary'));
  msg2.push(decipher.final('binary'));
  const toReturn = msg2.join('');
  return toReturn;
}

function makeHash(buffer) {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return hash;
}

function chopString(inputString, chunkSize) {
  const re = new RegExp(`(.{1,${chunkSize}})`, 'g');
  const result = inputString.match(re);
  return result;
}
