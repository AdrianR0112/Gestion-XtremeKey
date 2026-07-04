const { Router } = require('express');
const productosController = require('../modules/productos/productos.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { productImageUploadMiddleware } = require('../middlewares/upload.middleware');

const router = Router();

// Rutas públicas (catálogo del ecommerce)
router.get('/', productosController.list);
router.get('/:id', productosController.getById);

// Rutas protegidas (gestión desde el panel)
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.post('/', productImageUploadMiddleware, productosController.create);
router.put('/:id', productImageUploadMiddleware, productosController.update);
router.delete('/:id/imagen', productosController.removeImage);
router.delete('/:id', productosController.remove);

module.exports = { router };
