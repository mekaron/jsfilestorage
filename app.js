const express = require('express');

const app = express();

const jsfs = require('./jsfs');

app.use('/', jsfs);

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
