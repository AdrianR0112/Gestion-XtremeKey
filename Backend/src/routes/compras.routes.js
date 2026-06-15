const { Router } = require('express');
const comprasController = require('../modules/compras/compras.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', comprasController.list);
router.get('/:id', comprasController.getById);
router.post('/', comprasController.create);
router.put('/:id', comprasController.update);
router.delete('/:id', comprasController.remove);

module.exports = { router };
