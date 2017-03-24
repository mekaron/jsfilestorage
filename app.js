const express = require('express');

const jsfs = require('./jsfs');

const app = express();

app.use('/jsfs', jsfs);

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
