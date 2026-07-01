const { Router } = require('express');
const staffAuthController = require('../modules/staff-auth/staffAuth.controller');

const router = Router();

router.post('/login', staffAuthController.login);
router.get('/session', staffAuthController.session);
router.post('/logout', staffAuthController.logout);
router.post('/change-password', staffAuthController.changePassword);

module.exports = { router };
