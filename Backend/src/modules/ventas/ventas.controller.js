const ventasService = require('./ventas.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await ventasService.listVentas();
  res.status(200).json(successResponse(data, 'Ventas obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await ventasService.getVentaById(req.params.id);
  res.status(200).json(successResponse(data, 'Venta obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await ventasService.createVenta(req.body);
  res.status(201).json(successResponse(data, 'Venta creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await ventasService.updateVenta(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Venta actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await ventasService.deleteVenta(req.params.id);
  res.status(200).json(successResponse(null, 'Venta eliminada correctamente.'));
});

const createConRenovaciones = asyncHandler(async (req, res) => {
  const data = await ventasService.createVentaConDetallesYRenovaciones(req.body);
  res.status(201).json(successResponse(data, 'Venta creada con renovaciones correctamente.'));
});

module.exports = { list, getById, create, update, remove, createConRenovaciones };
