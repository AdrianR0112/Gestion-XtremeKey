const revendedoresService = require('./revendedores.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await revendedoresService.listRevendedores();
  res.status(200).json(successResponse(data, 'Revendedores obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await revendedoresService.getRevendedorById(req.params.id);
  res.status(200).json(successResponse(data, 'Revendedor obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await revendedoresService.createRevendedor(req.body);
  res.status(201).json(successResponse(data, 'Revendedor creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await revendedoresService.updateRevendedor(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Revendedor actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await revendedoresService.deleteRevendedor(req.params.id);
  res.status(200).json(successResponse(null, 'Revendedor eliminado correctamente.'));
});

module.exports = { list, getById, create, update, remove };
