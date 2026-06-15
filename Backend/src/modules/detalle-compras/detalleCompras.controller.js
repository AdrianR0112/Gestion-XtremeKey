const detalleComprasService = require('./detalleCompras.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await detalleComprasService.listDetalleCompras();
  res.status(200).json(successResponse(data, 'Detalle de compras obtenido correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await detalleComprasService.getDetalleCompraById(req.params.id);
  res.status(200).json(successResponse(data, 'Detalle de compra obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await detalleComprasService.createDetalleCompra(req.body);
  res.status(201).json(successResponse(data, 'Detalle de compra creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await detalleComprasService.updateDetalleCompra(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Detalle de compra actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await detalleComprasService.deleteDetalleCompra(req.params.id);
  res.status(200).json(successResponse(null, 'Detalle de compra eliminado correctamente.'));
});

module.exports = { list, getById, create, update, remove };
