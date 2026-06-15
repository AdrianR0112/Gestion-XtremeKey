const { Router } = require('express');
const categoriasController = require('../modules/categorias/categorias.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', categoriasController.list);
router.get('/:id', categoriasController.getById);
router.post('/', categoriasController.create);
router.put('/:id', categoriasController.update);
router.delete('/:id', categoriasController.remove);

module.exports = { router };
