const ordenesService = require('./ordenes.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await ordenesService.listOrdenes();
  res.status(200).json(successResponse(data, 'Ordenes obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await ordenesService.getOrdenById(req.params.id);
  res.status(200).json(successResponse(data, 'Orden obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await ordenesService.createOrden(req.body);
  res.status(201).json(successResponse(data, 'Orden creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await ordenesService.updateOrden(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Orden actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await ordenesService.deleteOrden(req.params.id);
  res.status(200).json(successResponse(null, 'Orden eliminada correctamente.'));
});

const listItems = asyncHandler(async (req, res) => {
  const data = await ordenesService.listItems(req.params.id);
  res.status(200).json(successResponse(data, 'Items de la orden obtenidos correctamente.'));
});

const getItemById = asyncHandler(async (req, res) => {
  const data = await ordenesService.getItemById(req.params.itemId);
  res.status(200).json(successResponse(data, 'Item de orden obtenido correctamente.'));
});

const createItem = asyncHandler(async (req, res) => {
  const data = await ordenesService.createItem(req.params.id, req.body);
  res.status(201).json(successResponse(data, 'Item de orden creado correctamente.'));
});

const updateItem = asyncHandler(async (req, res) => {
  const data = await ordenesService.updateItem(req.params.itemId, req.body);
  res.status(200).json(successResponse(data, 'Item de orden actualizado correctamente.'));
});

const removeItem = asyncHandler(async (req, res) => {
  await ordenesService.deleteItem(req.params.itemId);
  res.status(200).json(successResponse(null, 'Item de orden eliminado correctamente.'));
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  listItems,
  getItemById,
  createItem,
  updateItem,
  removeItem,
};
