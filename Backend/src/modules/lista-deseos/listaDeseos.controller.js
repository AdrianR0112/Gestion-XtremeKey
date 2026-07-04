const service = require('./listaDeseos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => res.status(200).json(successResponse(await service.listItems(), 'Lista de deseos obtenida correctamente.')));
const getById = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.getItemById(req.params.id), 'Registro de lista de deseos obtenido correctamente.')));
const create = asyncHandler(async (req, res) => res.status(201).json(successResponse(await service.createItem(req.body), 'Registro de lista de deseos creado correctamente.')));
const update = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.updateItem(req.params.id, req.body), 'Registro de lista de deseos actualizado correctamente.')));
const remove = asyncHandler(async (req, res) => { await service.deleteItem(req.params.id); res.status(200).json(successResponse(null, 'Registro de lista de deseos eliminado correctamente.')); });

const listMine = asyncHandler(async (req, res) => {
  const idCli = req.user?.Id_Cli;
  if (!idCli) return res.status(200).json(successResponse([], 'Sin lista de deseos asociada.'));
  const data = await service.listItemsByCliente(idCli);
  res.status(200).json(successResponse(data, 'Lista de deseos del cliente obtenida correctamente.'));
});

const createMine = asyncHandler(async (req, res) => {
  const idCli = req.user?.Id_Cli;
  if (!idCli) {
    const error = new Error('El usuario autenticado no tiene un cliente asociado.');
    error.statusCode = 400;
    throw error;
  }
  const data = await service.createItem({ ...(req.body || {}), Id_Cli: idCli });
  res.status(201).json(successResponse(data, 'Producto agregado a lista de deseos.'));
});

const removeMineByProducto = asyncHandler(async (req, res) => {
  const idCli = req.user?.Id_Cli;
  if (!idCli) {
    const error = new Error('El usuario autenticado no tiene un cliente asociado.');
    error.statusCode = 400;
    throw error;
  }
  await service.removeByClienteAndProducto(idCli, req.params.productoId);
  res.status(200).json(successResponse(null, 'Producto eliminado de lista de deseos.'));
});

module.exports = { list, listMine, createMine, removeMineByProducto, getById, create, update, remove };
