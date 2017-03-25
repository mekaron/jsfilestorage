const fs = require('fs');
const config = require('../config');

module.exports = (req, res) => {
  let html = fs.readFileSync('./public/target.html', 'utf8');
  html = html.replace('WEBSOCKET_PATH', config.websocketpath);
  res.send(html);
};
