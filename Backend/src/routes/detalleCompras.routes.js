const { Router } = require('express');
const detalleComprasController = require('../modules/detalle-compras/detalleCompras.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', detalleComprasController.list);
router.get('/:id', detalleComprasController.getById);
router.post('/', detalleComprasController.create);
router.put('/:id', detalleComprasController.update);
router.delete('/:id', detalleComprasController.remove);

module.exports = { router };
