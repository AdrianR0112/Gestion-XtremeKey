const { Router } = require('express');
const detalleVentasController = require('../modules/detalle-ventas/detalleVentas.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', detalleVentasController.list);
router.get('/by-cliente', detalleVentasController.findByCliente);
router.get('/:id', detalleVentasController.getById);
router.post('/', detalleVentasController.create);
router.put('/:id', detalleVentasController.update);
router.delete('/:id', detalleVentasController.remove);

module.exports = { router };
