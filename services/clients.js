const config = require('../config');

const Q = module.require('q');
const _ = module.require('lodash');

module.exports = {
  registerClient,
  getclients,
  getclient,
  storeclient,
  removeclient,
  msgclient,
  pushDataToClients,
  pushDataToSingleClient,
  removeFromClient,
  requestPromFromClients,
};

function registerClient(uuid, ws) {
  const p = {
    type: 'SETUP',
    uuid,
  };
  ws.send(JSON.stringify(p));
}
function getclients() {
  return _.keys(config.clients);
}
function getclient(clientSessionID) {
  return config.clients[clientSessionID];
}

function storeclient(client, clientSessionID) {
  let newclient = true;
  _.each(_.keys(config.clients), (key) => {
    if (_.get(config, `clients[${key}].uuid`) === client.uuid) {
      newclient = false;
    }
  });
  if (newclient) {
    config.clients[clientSessionID] = client;
    return true;
  }
  console.log('client id already known');
  return false;
}

function removeclient(clientSessionID) {
  delete config.clients[clientSessionID];
}

function msgclient(data, ws) {
  const p = {
    type: 'MSG',
    data,
  };
  ws.send(JSON.stringify(p));
}

function pushDataToClients(data, partID) {
  _.each(_.keys(config.clients), (key) => {
    pushDataToSingleClient(data, partID, config.clients[key]);
  });
}
function pushDataToSingleClient(data, partid, client) {
  const p = {
    type: 'STORE',
    partid,
    data,
  };
  client.ws.send(JSON.stringify(p));
}
function removeFromClient(partid, ws) {
  const p = {
    type: 'REMOVE',
    partid,
  };
  ws.send(JSON.stringify(p));
}

function requestPromFromClients(partid) {
  _.each(_.keys(config.clients), (key) => {
    const p = {
      type: 'REQUEST',
      partid,
    };
    const client = _.get(config, `clients[${key}].ws`);
    if (!client) {
      return console.log(`Client not found ${key}`);
    }
    client.send(JSON.stringify(p));
  });
  // returns an empty promise
  // fulfillment happens when a part returns from websocket
  const defer = Q.defer();
  return defer;
}
