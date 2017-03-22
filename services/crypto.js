const crypto = module.require('crypto');
const uuid = require('node-uuid');

exports.encrypt = (buffer) => {
  const cipher = crypto.createCipher('aes192', 'pass');
  const msg = [];
  msg.push(cipher.update(buffer, 'binary', 'base64'));
  msg.push(cipher.final('base64'));
  const foo = msg.join('');
  return foo;
};
exports.makeUUID = () => uuid.v1();

exports.decrypt = (foo) => {
  const decipher = crypto.createDecipher('aes192', 'pass');
  const msg2 = [];
  msg2.push(decipher.update(foo, 'base64', 'binary'));
  msg2.push(decipher.final('binary'));
  const toReturn = msg2.join('');
  return toReturn;
};

exports.makeHash = (buffer) => {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return hash;
};

exports.chopString = (inputString, chunkSize) => {
  const re = new RegExp(`(.{1,${chunkSize}})`, 'g');
  const result = inputString.match(re);
  return result;
};
