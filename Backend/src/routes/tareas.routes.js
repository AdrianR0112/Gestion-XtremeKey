const { Router } = require('express');
const tareasController = require('../modules/tareas/tareas.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', tareasController.list);
router.get('/:id', tareasController.getById);
router.post('/', tareasController.create);
router.put('/:id', tareasController.update);
router.delete('/:id', tareasController.remove);

module.exports = { router };
