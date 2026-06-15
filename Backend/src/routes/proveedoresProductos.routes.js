const { Router } = require('express');
const proveedoresProductosController = require('../modules/proveedores-productos/proveedoresProductos.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', proveedoresProductosController.list);
router.get('/:id', proveedoresProductosController.getById);
router.post('/', proveedoresProductosController.create);
router.put('/:id', proveedoresProductosController.update);
router.delete('/:id', proveedoresProductosController.remove);

module.exports = { router };
