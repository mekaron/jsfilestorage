const config = require('../config');

const Q = module.require('q');

exports.registerClient = (uuid, ws) => {
  const p = {
    type: 'SETUP',
    uuid,
  };
  ws.send(JSON.stringify(p));
};
exports.getclients = () => Object.keys(config.clients);
exports.getclient = clientSessionID => config.clients[clientSessionID];

exports.storeclient = (c, clientSessionID) => {
  let newclient = true;
  Object.keys(config.clients).forEach((key) => {
    if (config.clients[key].uuid === c.uuid) {
      newclient = false;
    }
  });
  if (newclient) {
    config.clients[clientSessionID] = c;
    return true;
  }
  console.log('client id already known');
  return false;
};
exports.removeclient = (clientSessionID) => {
  delete config.clients[clientSessionID];
};

exports.msgclient = (msg, ws) => {
  const p = {
    type: 'MSG',
    data: msg,
  };
  ws.send(JSON.stringify(p));
};

exports.pushDataToClients = (data, partID) => {
  Object.keys(config.clients).forEach((key) => {
    module.exports.pushDataToSingleClient(data, partID, config.clients[key]);
  });
};
exports.pushDataToSingleClient = (data, partID, client) => {
  const p = {
    type: 'STORE',
    partid: partID,
    data,
  };
  client.ws.send(JSON.stringify(p));
};
exports.removeFromClient = (partID, ws) => {
  const p = {
    type: 'REMOVE',
    partid: partID,
  };
  ws.send(JSON.stringify(p));
};

// request a single part from all clients
exports.requestPromFromClients = (partID) => {
  Object.keys(config.clients).forEach((key) => {
    const p = {
      type: 'REQUEST',
      partid: partID,
    };
    config.clients[key].ws.send(JSON.stringify(p));
  });
  const defer = Q.defer();
  return defer;
};
