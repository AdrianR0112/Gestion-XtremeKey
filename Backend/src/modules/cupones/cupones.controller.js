const cuponesService = require('./cupones.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await cuponesService.listCupones();
  res.status(200).json(successResponse(data, 'Cupones obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await cuponesService.getCuponById(req.params.id);
  res.status(200).json(successResponse(data, 'Cupon obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await cuponesService.createCupon(req.body);
  res.status(201).json(successResponse(data, 'Cupon creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await cuponesService.updateCupon(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Cupon actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await cuponesService.deleteCupon(req.params.id);
  res.status(200).json(successResponse(null, 'Cupon eliminado correctamente.'));
});

const listProductos = asyncHandler(async (req, res) => {
  const data = await cuponesService.listProductos(req.params.id);
  res.status(200).json(successResponse(data, 'Productos del cupon obtenidos correctamente.'));
});

const addProducto = asyncHandler(async (req, res) => {
  const data = await cuponesService.addProducto(req.params.id, req.body.Id_Prd);
  res.status(201).json(successResponse(data, 'Producto asociado al cupon correctamente.'));
});

const removeProducto = asyncHandler(async (req, res) => {
  await cuponesService.removeProducto(req.params.id, req.params.productoId);
  res.status(200).json(successResponse(null, 'Producto desasociado del cupon correctamente.'));
});

const listUsages = asyncHandler(async (_req, res) => {
  const data = await cuponesService.listUsages();
  res.status(200).json(successResponse(data, 'Usos de cupon obtenidos correctamente.'));
});

const getUsageById = asyncHandler(async (req, res) => {
  const data = await cuponesService.getUsageById(req.params.usoId);
  res.status(200).json(successResponse(data, 'Uso de cupon obtenido correctamente.'));
});

const createUsage = asyncHandler(async (req, res) => {
  const data = await cuponesService.createUsage(req.body);
  res.status(201).json(successResponse(data, 'Uso de cupon creado correctamente.'));
});

const updateUsage = asyncHandler(async (req, res) => {
  const data = await cuponesService.updateUsage(req.params.usoId, req.body);
  res.status(200).json(successResponse(data, 'Uso de cupon actualizado correctamente.'));
});

const removeUsage = asyncHandler(async (req, res) => {
  await cuponesService.deleteUsage(req.params.usoId);
  res.status(200).json(successResponse(null, 'Uso de cupon eliminado correctamente.'));
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  listProductos,
  addProducto,
  removeProducto,
  listUsages,
  getUsageById,
  createUsage,
  updateUsage,
  removeUsage,
};
