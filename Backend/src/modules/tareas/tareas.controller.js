const tareasService = require('./tareas.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await tareasService.listTareas();
  res.status(200).json(successResponse(data, 'Tareas obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await tareasService.getTareaById(req.params.id);
  res.status(200).json(successResponse(data, 'Tarea obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await tareasService.createTarea(req.body);
  res.status(201).json(successResponse(data, 'Tarea creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await tareasService.updateTarea(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Tarea actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await tareasService.deleteTarea(req.params.id);
  res.status(200).json(successResponse(null, 'Tarea eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
