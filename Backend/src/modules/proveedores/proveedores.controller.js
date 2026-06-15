const proveedoresService = require('./proveedores.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await proveedoresService.listProveedores();
  res.status(200).json(successResponse(data, 'Proveedores obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await proveedoresService.getProveedorById(req.params.id);
  res.status(200).json(successResponse(data, 'Proveedor obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await proveedoresService.createProveedor(req.body);
  res.status(201).json(successResponse(data, 'Proveedor creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await proveedoresService.updateProveedor(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Proveedor actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await proveedoresService.deleteProveedor(req.params.id);
  res.status(200).json(successResponse(null, 'Proveedor eliminado correctamente.'));
});

module.exports = { list, getById, create, update, remove };
