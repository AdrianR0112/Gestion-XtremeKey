const { Router } = require('express');
const dashboardController = require('../modules/dashboard/dashboard.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', dashboardController.getResumen);

module.exports = { router };
