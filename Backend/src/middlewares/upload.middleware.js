const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage()
});

const uploadMiddleware = upload.single('file');

module.exports = { uploadMiddleware };
