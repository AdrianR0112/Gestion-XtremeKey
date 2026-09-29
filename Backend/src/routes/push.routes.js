const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const pushController = require('../modules/push/push.controller');

const router = Router();
router.use(authMiddleware);
router.get('/vapid-public-key', pushController.getVapidPublicKey);
router.post('/subscribe', pushController.subscribe);
router.post('/unsubscribe', pushController.unsubscribe);
router.get('/subscriptions', pushController.list);
router.post('/test', pushController.test);

module.exports = { router };
