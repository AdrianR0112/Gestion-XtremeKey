const { Router } = require('express');
const plantillasController = require('../modules/plantillas-notificacion/plantillasNotificacion.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', plantillasController.list);
router.get('/:id', plantillasController.getById);
router.post('/', plantillasController.create);
router.put('/:id', plantillasController.update);
router.delete('/:id', plantillasController.remove);

module.exports = { router };
