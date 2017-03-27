const crypto = require('../services/crypto');
const clients = require('../services/clients');
const config = require('../config');

const WebSocketServer = require('ws').Server;
const _ = require('lodash');

module.exports = () => {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on('connection', (ws) => {
    const userSessionID = ws.upgradeReq.headers['sec-websocket-key'];
    console.log(userSessionID);
    ws.on('message', (message) => {
      const msg = JSON.parse(message);
      switch (msg.type) {
        case 'REGISTER':
          clients.registerClient(crypto.makeUUID(), ws);
          break;
        case 'LOGIN':
          msg.ws = ws;
          if (clients.storeclient(msg, userSessionID)) {
            clients.msgclient(`Hello client: ${msg.uuid}`, ws);
            if (msg.parts) {
              console.log('parts: ');
              console.log(msg.parts);
              msg.parts = JSON.parse(msg.parts);
              for (let i = 0; i < msg.parts.length; i += 1) {
                if (config.partstorage[msg.parts[i]]) {
                  if (config.partstorage[msg.parts[i]].clients.indexOf(userSessionID) === -1) {
                    config.partstorage[msg.parts[i]].clients.push(userSessionID);
                  }
                } else {
                  console.log(`${msg.parts[i]} is not in storage`);
                  clients.removeFromClient(msg.parts[i], ws);
                }
              }
            }
          } else {
            console.log(`refused client ${userSessionID}`);
            clients.msgclient('refused', ws);
          }
          break;
        case 'STORED':
          if (config.partstorage[msg.partid].clients.indexOf(userSessionID) === -1) {
            config.partstorage[msg.partid].clients.push(userSessionID);
          }
          console.log(`${userSessionID} stored ${msg.partid}`);
          break;
        case 'SERVE':
          if (config.partrequests.indexOf(msg.partid) >= 0) {
            console.log(`got served part ${msg.partid}`);
            config.partrequests.remove(msg.partid);
            clients.pushDataToClients(msg.data, msg.partid);
          } else if (config.requestedFileParts.indexOf(msg.partid) !== -1) {
            console.log(`got ${msg.partid} for download`);
            config.requestPromisesDefer[
              config.requestedFileParts.indexOf(msg.partid)
            ].resolve(msg.data);
          } else {
            console.log(`got served but didnt need ${msg.partid}`);
          }
          break;
        default:
          // fail silently
          break;
      }
    });
    ws.on('close', () => {
      clients.removeclient(userSessionID);
      Object.keys(config.partstorage).forEach((key) => {
        const partClients = config.partstorage[key].clients;
        if (partClients.indexOf(userSessionID) !== -1) {
          config.partstorage[key].clients = _.remove(partClients, userSessionID);
        }
      });
    });
  });
};
