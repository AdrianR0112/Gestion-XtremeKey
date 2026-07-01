const { Router } = require('express');
const suscripcionesController = require('../modules/suscripciones/suscripciones.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', suscripcionesController.list);
router.get('/by-cliente', suscripcionesController.listByCliente);
router.get('/:id', suscripcionesController.getById);
router.post('/', suscripcionesController.create);
router.put('/:id', suscripcionesController.update);
router.delete('/:id', suscripcionesController.remove);

module.exports = { router };
