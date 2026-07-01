const service = require('./listaDeseos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => res.status(200).json(successResponse(await service.listItems(), 'Lista de deseos obtenida correctamente.')));
const getById = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.getItemById(req.params.id), 'Registro de lista de deseos obtenido correctamente.')));
const create = asyncHandler(async (req, res) => res.status(201).json(successResponse(await service.createItem(req.body), 'Registro de lista de deseos creado correctamente.')));
const update = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.updateItem(req.params.id, req.body), 'Registro de lista de deseos actualizado correctamente.')));
const remove = asyncHandler(async (req, res) => { await service.deleteItem(req.params.id); res.status(200).json(successResponse(null, 'Registro de lista de deseos eliminado correctamente.')); });

module.exports = { list, getById, create, update, remove };
