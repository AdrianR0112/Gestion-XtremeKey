const { Router } = require('express');
const ordenesController = require('../modules/ordenes/ordenes.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

// Rutas para clientes autenticados: solo pueden ver/crear sus propias ordenes
router.get('/mis', authMiddleware, ordenesController.listMine);
router.post('/mis', authMiddleware, ordenesController.createMine);
router.get('/mis/:id', authMiddleware, ordenesController.getMine);

// Rutas de administracion (staff)
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'vendedor']));

router.get('/', ordenesController.list);
router.get('/items/:itemId', ordenesController.getItemById);
router.put('/items/:itemId', ordenesController.updateItem);
router.delete('/items/:itemId', ordenesController.removeItem);
router.get('/:id', ordenesController.getById);
router.post('/', ordenesController.create);
router.put('/:id', ordenesController.update);
router.delete('/:id', ordenesController.remove);
router.get('/:id/items', ordenesController.listItems);
router.post('/:id/items', ordenesController.createItem);

module.exports = { router };
