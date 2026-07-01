const { Router } = require('express');
const customerAuthController = require('../modules/customer-auth/customerAuth.controller');

const router = Router();

router.post('/register', customerAuthController.register);
router.post('/login', customerAuthController.login);
router.get('/session', customerAuthController.session);
router.post('/logout', customerAuthController.logout);

module.exports = { router };
