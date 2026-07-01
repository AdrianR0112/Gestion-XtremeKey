const { Router } = require('express');
const pagosController = require('../modules/pagos/pagos.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', pagosController.list);
router.get('/:id', pagosController.getById);
router.post('/', pagosController.create);
router.put('/:id', pagosController.update);
router.delete('/:id', pagosController.remove);

module.exports = { router };
