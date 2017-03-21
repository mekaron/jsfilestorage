var express = require('express')
var app = express()
var router = express.Router();
var multer  = require('multer');
const uuid = require('node-uuid');
const crypto = require('./services/crypto');

const files = {}

router.use(multer({
	rename: function (fieldname, filename) {
		return uuid.v1().replace(/-/g, '');
	},
	onFileUploadStart: function (file) {
        // console.log(file);
	},
	onFileUploadComplete: function (file) {
		// console.log(file);
	},
	limits: {
	  fieldSize : 5000000
	},
	inMemory: true
}));


router.get('/:hash', (req, res) => {
    res.send(files[req.params.hash])
})

router.post('/', (req, res) => {
    const hash = crypto.makeHash(req.files.image.buffer);
    files[hash] = req.files.image.buffer;
    res.send(hash);
})

module.exports = router;
