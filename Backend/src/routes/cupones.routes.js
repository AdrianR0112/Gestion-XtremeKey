const { Router } = require('express');
const cuponesController = require('../modules/cupones/cupones.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', cuponesController.list);
router.get('/usos', cuponesController.listUsages);
router.get('/usos/:usoId', cuponesController.getUsageById);
router.post('/usos', cuponesController.createUsage);
router.put('/usos/:usoId', cuponesController.updateUsage);
router.delete('/usos/:usoId', cuponesController.removeUsage);
router.get('/:id', cuponesController.getById);
router.post('/', cuponesController.create);
router.put('/:id', cuponesController.update);
router.delete('/:id', cuponesController.remove);
router.get('/:id/productos', cuponesController.listProductos);
router.post('/:id/productos', cuponesController.addProducto);
router.delete('/:id/productos/:productoId', cuponesController.removeProducto);

module.exports = { router };
