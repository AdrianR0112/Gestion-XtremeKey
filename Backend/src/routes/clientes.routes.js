const { Router } = require('express');
const clientesController = require('../modules/clientes/clientes.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { uploadMiddleware } = require('../middlewares/upload.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', clientesController.list);
router.post('/import', uploadMiddleware, clientesController.importFromFile);
router.get('/:id', clientesController.getById);
router.post('/', clientesController.create);
router.put('/:id', clientesController.update);
router.delete('/:id', clientesController.remove);

module.exports = { router };
