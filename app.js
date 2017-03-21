var express = require('express')
var app = express()
var uuid 	= require('node-uuid');

const crypto = require('./services/crypto');

var multer  = require('multer');

const files = {}

app.use(multer({
	rename: function (fieldname, filename) {
		return uuid.v1().replace(/-/g, '');
	},
	onFileUploadStart: function (file) {
        console.log(file);
	},
	onFileUploadComplete: function (file) {
		// console.log(file);
	},
	limits: {
	  fieldSize : 5000000
	},
	inMemory: true
}));

app.get('/:hash', function (req, res) {
  res.send(files[req.params.hash]);
})
app.post('/', function (req, res) {
    // console.log(req.files.image)
    const hash = crypto.makeHash(req.files.image.buffer);
    files[hash] = req.files.image.buffer;
    res.send(hash);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
