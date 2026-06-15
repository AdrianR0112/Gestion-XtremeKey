const cuentasService = require('./cuentas.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await cuentasService.listCuentas();
  res.status(200).json(successResponse(data, 'Cuentas obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await cuentasService.getCuentaById(req.params.id);
  res.status(200).json(successResponse(data, 'Cuenta obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await cuentasService.createCuenta(req.body);
  res.status(201).json(successResponse(data, 'Cuenta creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await cuentasService.updateCuenta(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Cuenta actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await cuentasService.deleteCuenta(req.params.id);
  res.status(200).json(successResponse(null, 'Cuenta eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
