const keysService = require('./keys.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await keysService.listKeys();
  res.status(200).json(successResponse(data, 'Keys obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await keysService.getKeyById(req.params.id);
  res.status(200).json(successResponse(data, 'Key obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await keysService.createKey(req.body);
  res.status(201).json(successResponse(data, 'Key creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await keysService.updateKey(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Key actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await keysService.deleteKey(req.params.id);
  res.status(200).json(successResponse(null, 'Key eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
