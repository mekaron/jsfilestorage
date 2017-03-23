const Q = module.require('q');
const clients = {};

exports.registerClient = (uuid, ws) => {
  const p = {
    type: 'SETUP',
    uuid,
  };
  ws.send(JSON.stringify(p));
};
exports.getclients = () => Object.keys(clients);
exports.getclient = clientSessionID => clients[clientSessionID];

exports.storeclient = (c, clientSessionID) => {
  let newclient = true;
  Object.keys(clients).forEach((key) => {
    if (clients[key].uuid === c.uuid) {
      newclient = false;
    }
  });
  if (newclient) {
    clients[clientSessionID] = c;
    return true;
  }
  console.log('client id already known');
  return false;
};
exports.removeclient = (clientSessionID) => {
  delete clients[clientSessionID];
};
exports.msgclient = (msg, ws) => {
  const p = {
    type: 'MSG',
    data: msg,
  };
  ws.send(JSON.stringify(p));
};

// push data to all connected clients
// lets talk about how I would improve this!
exports.pushDataToClients = (data, partID) => {
  Object.keys(clients).forEach((key) => {
    module.exports.pushDataToSingleClient(data, partID, clients[key]);
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
  const defer = Q.defer();
  Object.keys(clients).forEach((key) => {
    const p = {
      type: 'REQUEST',
      partid: partID,
    };
    clients[key].ws.send(JSON.stringify(p));
  });
  return defer;
};
