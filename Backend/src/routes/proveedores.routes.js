const { Router } = require('express');
const proveedoresController = require('../modules/proveedores/proveedores.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', proveedoresController.list);
router.get('/:id', proveedoresController.getById);
router.post('/', proveedoresController.create);
router.put('/:id', proveedoresController.update);
router.delete('/:id', proveedoresController.remove);

module.exports = { router };
