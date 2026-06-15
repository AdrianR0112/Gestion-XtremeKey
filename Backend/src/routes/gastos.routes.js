const { Router } = require('express');
const gastosController = require('../modules/gastos/gastos.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', gastosController.list);
router.get('/:id', gastosController.getById);
router.post('/', gastosController.create);
router.put('/:id', gastosController.update);
router.delete('/:id', gastosController.remove);

module.exports = { router };
