const { Router } = require('express');
const calendarioController = require('../modules/calendario/calendario.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validateMiddleware } = require('../middlewares/validate.middleware');
const { calendarioQuerySchema } = require('../modules/calendario/calendario.validator');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', validateMiddleware(calendarioQuerySchema, 'query'), calendarioController.list);

module.exports = { router };
