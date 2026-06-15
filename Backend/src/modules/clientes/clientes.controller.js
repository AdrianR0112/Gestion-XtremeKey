const clientesService = require('./clientes.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await clientesService.listClientes();
  res.status(200).json(successResponse(data, 'Clientes obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await clientesService.getClienteById(req.params.id);
  res.status(200).json(successResponse(data, 'Cliente obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await clientesService.createCliente(req.body);
  res.status(201).json(successResponse(data, 'Cliente creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await clientesService.updateCliente(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Cliente actualizado correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await clientesService.deleteCliente(req.params.id);
  res.status(200).json(successResponse(null, 'Cliente eliminado correctamente.'));
});

const importFromFile = asyncHandler(async (req, res) => {
  const data = await clientesService.importClientesFromFile(req.file);
  res.status(200).json(successResponse(data, 'Clientes importados correctamente.'));
});

module.exports = { list, getById, create, update, remove, importFromFile };
