const pagosService = require('./pagos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await pagosService.listPagos();
  res.status(200).json(successResponse(data, 'Pagos obtenidos correctamente.'));
});

const listMine = asyncHandler(async (req, res) => {
  const idCli = req.user?.Id_Cli;
  if (!idCli) {
    return res.status(200).json(successResponse([], 'Sin pagos asociados al usuario.'));
  }
  const data = await pagosService.listPagosByCliente(idCli);
  res.status(200).json(successResponse(data, 'Pagos del cliente obtenidos correctamente.'));
});

const createMine = asyncHandler(async (req, res) => {
  const idCli = req.user?.Id_Cli;
  if (!idCli) {
    const error = new Error('El usuario autenticado no tiene un cliente asociado.');
    error.statusCode = 400;
    throw error;
  }
  const idOrd = req.body?.Id_Ord;
  if (!idOrd) {
    const error = new Error('Id_Ord es requerido.');
    error.statusCode = 400;
    throw error;
  }
  await pagosService.ensureOrdenPerteneceACliente(idOrd, idCli);
  const data = await pagosService.createPago(req.body);
  res.status(201).json(successResponse(data, 'Pago registrado correctamente.'));
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

module.exports = { list, listMine, createMine, getById, create, update, remove };
