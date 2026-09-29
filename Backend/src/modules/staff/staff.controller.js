const staffService = require('./staff.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await staffService.listStaff();
  res.status(200).json(successResponse(data, 'Staff obtenido correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await staffService.getStaffById(req.params.id);
  res.status(200).json(successResponse(data, 'Staff obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await staffService.createStaff(req.body);
  res.status(201).json(successResponse(data, 'Staff creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await staffService.updateStaff(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Staff actualizado correctamente.'));
});

const updateEstado = asyncHandler(async (req, res) => {
  const data = await staffService.updateEstado(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Estado actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await staffService.deleteStaff(req.params.id);
  res.status(200).json(successResponse(null, 'Staff eliminado correctamente.'));
});

module.exports = { list, getById, create, update, updateEstado, remove };
