const { Router } = require('express');
const cuentasController = require('../modules/cuentas/cuentas.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', cuentasController.list);
router.get('/:id', cuentasController.getById);
router.post('/', cuentasController.create);
router.put('/:id', cuentasController.update);
router.delete('/:id', cuentasController.remove);

module.exports = { router };
