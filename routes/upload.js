const config = require('../config');
const fs = require('fs');

module.exports = (req, res) => {
  let html = fs.readFileSync('./public/index.html', 'utf8');
  html = html.replace('PUSH_API_PATH', config.mounted);
  res.send(html);
};
