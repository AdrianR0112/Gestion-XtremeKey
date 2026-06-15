const renovacionesService = require('./renovaciones.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await renovacionesService.listRenovaciones();
  res.status(200).json(successResponse(data, 'Renovaciones obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await renovacionesService.getRenovacionById(req.params.id);
  res.status(200).json(successResponse(data, 'Renovacion obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await renovacionesService.createRenovacion(req.body);
  res.status(201).json(successResponse(data, 'Renovacion creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await renovacionesService.updateRenovacion(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Renovacion actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await renovacionesService.deleteRenovacion(req.params.id);
  res.status(200).json(successResponse(null, 'Renovacion eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
