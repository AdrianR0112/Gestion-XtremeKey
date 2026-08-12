const { Router } = require('express');
const dashboardController = require('../modules/dashboard/dashboard.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validateMiddleware } = require('../middlewares/validate.middleware');
const { dashboardQuerySchema } = require('../modules/dashboard/dashboard.validator');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', validateMiddleware(dashboardQuerySchema, 'query'), dashboardController.getResumen);

module.exports = { router };
