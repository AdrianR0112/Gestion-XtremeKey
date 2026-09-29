const { Router } = require('express');
const suscripcionesController = require('../modules/suscripciones/suscripciones.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

// Rutas para clientes autenticados
router.get('/mis', authMiddleware, suscripcionesController.listMine);

// Rutas administrativas
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

// Las rutas estaticas van antes que /:id, si no /resumen entraria por getById.
router.get('/', suscripcionesController.list);
router.get('/resumen', suscripcionesController.resumen);
router.get('/by-cliente', suscripcionesController.listByCliente);
router.get('/by-revendedor', suscripcionesController.listByRevendedor);
router.post('/renovar-lote', suscripcionesController.renovarLote);

router.get('/:id', suscripcionesController.getById);
router.get('/:id/historial', suscripcionesController.historial);
router.get('/:id/mensaje-whatsapp', suscripcionesController.mensajeWhatsapp);
router.post('/:id/renovar', suscripcionesController.renovar);
router.post('/', suscripcionesController.create);
router.put('/:id', suscripcionesController.update);
router.delete('/:id', suscripcionesController.remove);

module.exports = { router };
