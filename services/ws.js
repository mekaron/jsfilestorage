const crypto = require('../services/crypto');
const sniper = require('../services/clients');
const config = require('../config');

const WebSocketServer = require('ws').Server;

module.exports = () => {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on('connection', (ws) => {
    const userSessionID = ws.upgradeReq.headers['sec-websocket-key'];
    console.log(userSessionID);
    ws.on('message', (message) => {
      const msg = JSON.parse(message);
      switch (msg.type) {
        default:
          break;
        case 'REGISTER':
          sniper.registerClient(crypto.makeUUID(), ws);
          break;
        case 'LOGIN':
          msg.ws = ws;
          if (sniper.storeclient(msg, userSessionID)) {
            sniper.msgclient(`Hello client: ${msg.uuid}`, ws);
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
                  sniper.removeFromClient(msg.parts[i], ws);
                }
              }
            }
          } else {
            console.log(`refused client ${userSessionID}`);
            sniper.msgclient('refused', ws);
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
            sniper.pushDataToClients(msg.data, msg.partid);
          } else if (config.tempfile_index_reference.indexOf(msg.partid) !== -1) {
            console.log(`got ${msg.partid} for download`);
            config.deferred_references[
              config.tempfile_index_reference.indexOf(msg.partid)
            ].resolve(msg.data);
          } else {
            console.log(`got served but didnt need ${msg.partid}`);
          }
          break;
      }
    });
    ws.on('close', () => {
      sniper.removeclient(userSessionID);
      Object.keys(config.partstorage).forEach((key) => {
        if (config.partstorage[key].clients.indexOf(userSessionID) !== -1) {
          config.partstorage[key].clients.remove(userSessionID);
        }
      });
    });
  });
};
