const suscripcionesService = require('./suscripciones.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await suscripcionesService.listSuscripciones();
  res.status(200).json(successResponse(data, 'Suscripciones obtenidas correctamente.'));
});

const listByCliente = asyncHandler(async (req, res) => {
  const { clienteId } = req.query;
  if (!clienteId) {
    return res.status(400).json({ ok: false, message: 'clienteId query param is required.' });
  }

  const data = await suscripcionesService.listSuscripcionesByCliente(clienteId);
  res.status(200).json(successResponse(data, 'Suscripciones del cliente obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.getSuscripcionById(req.params.id);
  res.status(200).json(successResponse(data, 'Suscripcion obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.createSuscripcion(req.body);
  res.status(201).json(successResponse(data, 'Suscripcion creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.updateSuscripcion(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Suscripcion actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await suscripcionesService.deleteSuscripcion(req.params.id);
  res.status(200).json(successResponse(null, 'Suscripcion eliminada correctamente.'));
});

module.exports = { list, listByCliente, getById, create, update, remove };
