const configuracionService = require('./configuracion.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await configuracionService.listConfiguraciones();
  res.status(200).json(successResponse(data, 'Configuraciones obtenidas correctamente.'));
});

const getActual = asyncHandler(async (_req, res) => {
  const data = await configuracionService.getConfiguracionActual();
  res.status(200).json(successResponse(data, 'Configuracion actual obtenida correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await configuracionService.getConfiguracionById(req.params.id);
  res.status(200).json(successResponse(data, 'Configuracion obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await configuracionService.createConfiguracion(req.body);
  res.status(201).json(successResponse(data, 'Configuracion creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await configuracionService.updateConfiguracion(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Configuracion actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await configuracionService.deleteConfiguracion(req.params.id);
  res.status(200).json(successResponse(null, 'Configuracion eliminada correctamente.'));
});

module.exports = { list, getActual, getById, create, update, remove };
