const categoriasService = require('./categorias.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await categoriasService.listCategorias();
  res.status(200).json(successResponse(data, 'Categorias obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await categoriasService.getCategoriaById(req.params.id);
  res.status(200).json(successResponse(data, 'Categoria obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await categoriasService.createCategoria(req.body);
  res.status(201).json(successResponse(data, 'Categoria creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await categoriasService.updateCategoria(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Categoria actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await categoriasService.deleteCategoria(req.params.id);
  res.status(200).json(successResponse(null, 'Categoria eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
