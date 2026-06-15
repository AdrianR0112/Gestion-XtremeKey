const { Router } = require('express');
const ventasController = require('../modules/ventas/ventas.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', ventasController.list);
router.get('/:id', ventasController.getById);
router.post('/', ventasController.create);
router.post('/con-renovaciones', ventasController.createConRenovaciones);
router.put('/:id', ventasController.update);
router.delete('/:id', ventasController.remove);

module.exports = { router };
