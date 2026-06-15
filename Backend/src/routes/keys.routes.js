const { Router } = require('express');
const keysController = require('../modules/keys/keys.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', keysController.list);
router.get('/:id', keysController.getById);
router.post('/', keysController.create);
router.put('/:id', keysController.update);
router.delete('/:id', keysController.remove);

module.exports = { router };
