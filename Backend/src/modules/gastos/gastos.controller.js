const gastosService = require('./gastos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await gastosService.listGastos();
  res.status(200).json(successResponse(data, 'Gastos obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await gastosService.getGastoById(req.params.id);
  res.status(200).json(successResponse(data, 'Gasto obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await gastosService.createGasto(req.body);
  res.status(201).json(successResponse(data, 'Gasto creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await gastosService.updateGasto(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Gasto actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await gastosService.deleteGasto(req.params.id);
  res.status(200).json(successResponse(null, 'Gasto eliminado correctamente.'));
});

module.exports = { list, getById, create, update, remove };
