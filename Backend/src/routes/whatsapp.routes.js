const { Router } = require('express');
const whatsappController = require('../modules/whatsapp/whatsapp.controller');
const { contextoQuerySchema } = require('../modules/whatsapp/whatsapp.validator');
const { validateMiddleware } = require('../middlewares/validate.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));
router.get('/contexto', validateMiddleware(contextoQuerySchema, 'query'), whatsappController.contexto);

module.exports = { router };
