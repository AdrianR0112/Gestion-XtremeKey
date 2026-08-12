const { Router } = require('express');
const renovacionesController = require('../modules/renovaciones/renovaciones.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', renovacionesController.list);

module.exports = { router };
