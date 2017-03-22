const express = require('express');
const multer = require('multer');
const uuid = require('node-uuid');

const crypto = require('./services/crypto');

const router = express.Router();

const files = {};

router.use(multer({
  rename() {
    return uuid.v1().replace(/-/g, '');
  },
  limits: {
    fieldSize: 5000000,
  },
  inMemory: true,
}));


router.get('/:hash', (req, res) => {
  res.send(files[req.params.hash]);
});

router.post('/', (req, res) => {
  const hash = crypto.makeHash(req.files.image.buffer);
  files[hash] = req.files.image.buffer;
  res.send(hash);
});

module.exports = router;
