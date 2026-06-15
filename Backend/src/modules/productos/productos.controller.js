const productosService = require('./productos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await productosService.listProductos();
  res.status(200).json(successResponse(data, 'Productos obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await productosService.getProductoById(req.params.id);
  res.status(200).json(successResponse(data, 'Producto obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await productosService.createProducto(req.body);
  res.status(201).json(successResponse(data, 'Producto creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await productosService.updateProducto(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Producto actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await productosService.deleteProducto(req.params.id);
  res.status(200).json(successResponse(null, 'Producto eliminado correctamente.'));
});

module.exports = { list, getById, create, update, remove };
