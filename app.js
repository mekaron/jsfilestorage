var express = require('express')
var app = express()

const jsfs = require('./jsfs');

app.use('/', jsfs);

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
