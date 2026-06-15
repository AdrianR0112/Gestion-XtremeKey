const detalleVentasService = require('./detalleVentas.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await detalleVentasService.listDetalleVentas();
  res.status(200).json(successResponse(data, 'Detalle de ventas obtenido correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await detalleVentasService.getDetalleVentaById(req.params.id);
  res.status(200).json(successResponse(data, 'Detalle de venta obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await detalleVentasService.createDetalleVenta(req.body);
  res.status(201).json(successResponse(data, 'Detalle de venta creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await detalleVentasService.updateDetalleVenta(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Detalle de venta actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await detalleVentasService.deleteDetalleVenta(req.params.id);
  res.status(200).json(successResponse(null, 'Detalle de venta eliminado correctamente.'));
});

const findByCliente = asyncHandler(async (req, res) => {
  const { clienteId } = req.query;
  if (!clienteId) {
    return res.status(400).json({ ok: false, message: 'clienteId query param is required.' });
  }
  const data = await detalleVentasService.listByCliente(clienteId);
  res.status(200).json(successResponse(data, 'Licencias del cliente obtenidas correctamente.'));
});

module.exports = { list, getById, create, update, remove, findByCliente };
