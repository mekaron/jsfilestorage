const express = require('express');
const multer = require('multer');
const uuid = require('node-uuid');
const config = require('./config');

const router = express.Router();

router.use((req, res, next) => {
  if (!config.mounted) {
    return next(new Error('No mounted path'));
  }
  next();
});

router.use(multer({
  rename() {
    return uuid.v4().replace(/-/g, '');
  },
  limits: {
    fieldSize: 500000, // 500mb
  },
  inMemory: true,
}));


router.get('/', require('./routes/upload'));
router.get('/target', require('./routes/target'));
router.get('/:id', require('./routes/downloadFile'));
router.post('/', require('./routes/uploadFile'));

require('./services/ws')();

module.exports = router;
