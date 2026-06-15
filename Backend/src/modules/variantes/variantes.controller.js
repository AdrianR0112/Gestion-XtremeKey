const variantesService = require('./variantes.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await variantesService.listVariantes();
  res.status(200).json(successResponse(data, 'Variantes obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await variantesService.getVarianteById(req.params.id);
  res.status(200).json(successResponse(data, 'Variante obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await variantesService.createVariante(req.body);
  res.status(201).json(successResponse(data, 'Variante creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await variantesService.updateVariante(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Variante actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await variantesService.deleteVariante(req.params.id);
  res.status(200).json(successResponse(null, 'Variante eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
