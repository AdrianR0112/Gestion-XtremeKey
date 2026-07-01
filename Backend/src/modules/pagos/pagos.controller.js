const pagosService = require('./pagos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await pagosService.listPagos();
  res.status(200).json(successResponse(data, 'Pagos obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await pagosService.getPagoById(req.params.id);
  res.status(200).json(successResponse(data, 'Pago obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await pagosService.createPago(req.body);
  res.status(201).json(successResponse(data, 'Pago creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await pagosService.updatePago(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Pago actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await pagosService.deletePago(req.params.id);
  res.status(200).json(successResponse(null, 'Pago eliminado correctamente.'));
});

module.exports = { list, getById, create, update, remove };
