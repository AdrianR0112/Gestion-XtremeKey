const usuariosService = require('./usuarios.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await usuariosService.listUsuarios();
  res.status(200).json(successResponse(data, 'Usuarios obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await usuariosService.getUsuarioById(req.params.id);
  res.status(200).json(successResponse(data, 'Usuario obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await usuariosService.createUsuario(req.body);
  res.status(201).json(successResponse(data, 'Usuario creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await usuariosService.updateUsuario(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Usuario actualizado correctamente.'));
});

const updateEstado = asyncHandler(async (req, res) => {
  const data = await usuariosService.updateEstado(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Estado de usuario actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await usuariosService.deleteUsuario(req.params.id);
  res.status(200).json(successResponse(null, 'Usuario eliminado correctamente.'));
});

module.exports = { list, getById, create, update, updateEstado, remove };
