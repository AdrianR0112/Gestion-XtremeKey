const carritoService = require('./carrito.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await carritoService.listCarritos();
  res.status(200).json(successResponse(data, 'Carritos obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await carritoService.getCarritoById(req.params.id);
  res.status(200).json(successResponse(data, 'Carrito obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await carritoService.createCarrito(req.body);
  res.status(201).json(successResponse(data, 'Carrito creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await carritoService.updateCarrito(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Carrito actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await carritoService.deleteCarrito(req.params.id);
  res.status(200).json(successResponse(null, 'Carrito eliminado correctamente.'));
});

const listItems = asyncHandler(async (req, res) => {
  const data = await carritoService.listItems(req.params.id);
  res.status(200).json(successResponse(data, 'Items del carrito obtenidos correctamente.'));
});

const getItemById = asyncHandler(async (req, res) => {
  const data = await carritoService.getItemById(req.params.itemId);
  res.status(200).json(successResponse(data, 'Item de carrito obtenido correctamente.'));
});

const createItem = asyncHandler(async (req, res) => {
  const data = await carritoService.createItem(req.params.id, req.body);
  res.status(201).json(successResponse(data, 'Item de carrito creado correctamente.'));
});

const updateItem = asyncHandler(async (req, res) => {
  const data = await carritoService.updateItem(req.params.itemId, req.body);
  res.status(200).json(successResponse(data, 'Item de carrito actualizado correctamente.'));
});

const removeItem = asyncHandler(async (req, res) => {
  await carritoService.deleteItem(req.params.itemId);
  res.status(200).json(successResponse(null, 'Item de carrito eliminado correctamente.'));
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
