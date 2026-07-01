const { Router } = require('express');
const staffController = require('../modules/staff/staff.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validateMiddleware } = require('../middlewares/validate.middleware');
const { createPayloadSchema, updatePayloadSchema, estadoPayloadSchema } = require('../modules/staff/staff.validator');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', staffController.list);
router.get('/:id', staffController.getById);
router.post('/', validateMiddleware(createPayloadSchema), staffController.create);
router.put('/:id', validateMiddleware(updatePayloadSchema), staffController.update);
router.patch('/:id/estado', validateMiddleware(estadoPayloadSchema), staffController.updateEstado);
router.delete('/:id', staffController.remove);

module.exports = { router };
