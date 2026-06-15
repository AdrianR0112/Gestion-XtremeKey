const { Router } = require('express');
const configuracionController = require('../modules/configuracion/configuracion.controller');

const router = Router();

router.get('/', configuracionController.list);
router.get('/actual', configuracionController.getActual);
router.get('/:id', configuracionController.getById);
router.post('/', configuracionController.create);
router.put('/:id', configuracionController.update);
router.delete('/:id', configuracionController.remove);

module.exports = { router };
