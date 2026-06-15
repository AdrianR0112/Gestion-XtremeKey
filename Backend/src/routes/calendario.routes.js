const { Router } = require('express');
const calendarioController = require('../modules/calendario/calendario.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', calendarioController.list);

module.exports = { router };