const { Router } = require('express');
const variantesController = require('../modules/variantes/variantes.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', variantesController.list);
router.get('/:id', variantesController.getById);
router.post('/', variantesController.create);
router.put('/:id', variantesController.update);
router.delete('/:id', variantesController.remove);

module.exports = { router };
