const { Router } = require('express');
const usuariosController = require('../modules/usuarios/usuarios.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', usuariosController.list);
router.get('/:id', usuariosController.getById);
router.post('/', usuariosController.create);
router.put('/:id', usuariosController.update);
router.patch('/:id/estado', usuariosController.updateEstado);
router.delete('/:id', usuariosController.remove);

module.exports = { router };
