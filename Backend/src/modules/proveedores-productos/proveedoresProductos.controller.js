const proveedoresProductosService = require('./proveedoresProductos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await proveedoresProductosService.listRelaciones();
  res.status(200).json(successResponse(data, 'Relaciones proveedor-producto obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await proveedoresProductosService.getRelacionById(req.params.id);
  res.status(200).json(successResponse(data, 'Relacion proveedor-producto obtenida correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await proveedoresProductosService.createRelacion(req.body);
  res.status(201).json(successResponse(data, 'Relacion proveedor-producto creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await proveedoresProductosService.updateRelacion(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Relacion proveedor-producto actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await proveedoresProductosService.deleteRelacion(req.params.id);
  res.status(200).json(successResponse(null, 'Relacion proveedor-producto eliminada correctamente.'));
});

module.exports = { list, getById, create, update, remove };
