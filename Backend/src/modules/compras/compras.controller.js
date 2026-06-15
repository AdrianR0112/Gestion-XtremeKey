const comprasService = require('./compras.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await comprasService.listCompras();
  res.status(200).json(successResponse(data, 'Compras obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await comprasService.getCompraById(req.params.id);
  res.status(200).json(successResponse(data, 'Compra obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await comprasService.createCompra(req.body);
  res.status(201).json(successResponse(data, 'Compra creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await comprasService.updateCompra(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Compra actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await comprasService.deleteCompra(req.params.id);
  res.status(200).json(successResponse(null, 'Compra eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
