const express = require('express');
const multer = require('multer');
const uuid = require('node-uuid');
const config = require('./config');

const router = express.Router();

// export config to outside
router.config = config;

router.use((req, res, next) => {
  if (!config.mounted) {
    return next(new Error('No mounted path'));
  }
  next();
});

router.use(multer({
  rename() {
    return uuid.v1().replace(/-/g, '');
  },
  limits: {
    fieldSize: 5000000,
  },
  inMemory: true,
}));

router.use('/public', express.static('public'));
router.get('/:id', require('./routes/downloadFile'));
router.post('/', require('./routes/uploadFile'));

require('./services/ws')();

module.exports = router;
