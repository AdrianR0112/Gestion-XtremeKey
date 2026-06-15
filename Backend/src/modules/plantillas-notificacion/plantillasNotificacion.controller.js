const plantillasService = require('./plantillasNotificacion.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await plantillasService.listPlantillas();
  res.status(200).json(successResponse(data, 'Plantillas obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await plantillasService.getPlantillaById(req.params.id);
  res.status(200).json(successResponse(data, 'Plantilla obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await plantillasService.createPlantilla(req.body);
  res.status(201).json(successResponse(data, 'Plantilla creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await plantillasService.updatePlantilla(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Plantilla actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await plantillasService.deletePlantilla(req.params.id);
  res.status(200).json(successResponse(null, 'Plantilla eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
