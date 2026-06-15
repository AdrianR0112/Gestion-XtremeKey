const { Router } = require('express');
const revendedoresController = require('../modules/revendedores/revendedores.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', revendedoresController.list);
router.get('/:id', revendedoresController.getById);
router.post('/', revendedoresController.create);
router.put('/:id', revendedoresController.update);
router.delete('/:id', revendedoresController.remove);

module.exports = { router };
