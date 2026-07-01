const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');

const uploadsRoot = path.join(__dirname, '../../uploads');
const productUploadsDir = path.join(uploadsRoot, 'productos');

const allowedProductImageMimeTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/svg+xml'
]);

function ensureDirectoryExists(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

const importUpload = multer({
  storage: multer.memoryStorage()
});

const productImageUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureDirectoryExists(productUploadsDir);
      cb(null, productUploadsDir);
    },
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname || '').toLowerCase();
      const safeExtension = extension || '.bin';
      cb(null, `producto-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    if (allowedProductImageMimeTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    const error = new Error('Solo se permiten imagenes SVG, PNG o JPG/JPEG.');
    error.statusCode = 400;
    cb(error);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const uploadMiddleware = importUpload.single('file');
const productImageUploadMiddleware = productImageUpload.single('image');

module.exports = {
  uploadMiddleware,
  productImageUploadMiddleware,
  uploadsRoot
};
