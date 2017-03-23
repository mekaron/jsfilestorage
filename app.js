const express = require('express');

const jsfs = require('./jsfs');

jsfs.setSetting('mounted', '/jsfs');

const app = express();

app.use(jsfs.getSetting('mounted'), jsfs);

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
