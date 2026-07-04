const { Router } = require('express');
const controller = require('../modules/lista-deseos/listaDeseos.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = Router();

// Rutas para clientes autenticados
router.get('/mis', authMiddleware, controller.listMine);
router.post('/mis', authMiddleware, controller.createMine);
router.delete('/mis/producto/:productoId', authMiddleware, controller.removeMineByProducto);

// Rutas administrativas
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = { router };
