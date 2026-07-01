const { Router } = require('express');
const carritoController = require('../modules/carrito/carrito.controller');

const router = Router();

router.get('/', carritoController.list);
router.get('/items/:itemId', carritoController.getItemById);
router.put('/items/:itemId', carritoController.updateItem);
router.delete('/items/:itemId', carritoController.removeItem);
router.get('/:id', carritoController.getById);
router.post('/', carritoController.create);
router.put('/:id', carritoController.update);
router.delete('/:id', carritoController.remove);
router.get('/:id/items', carritoController.listItems);
router.post('/:id/items', carritoController.createItem);

module.exports = { router };
