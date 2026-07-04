const { Router } = require('express');
const categoriasController = require('../modules/categorias/categorias.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

// Rutas públicas (catálogo del ecommerce)
router.get('/', categoriasController.list);
router.get('/:id', categoriasController.getById);

// Rutas protegidas
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.post('/', categoriasController.create);
router.put('/:id', categoriasController.update);
router.delete('/:id', categoriasController.remove);

module.exports = { router };
