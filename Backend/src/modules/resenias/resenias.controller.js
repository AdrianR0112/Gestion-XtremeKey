const service = require('./resenias.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => res.status(200).json(successResponse(await service.listResenias(), 'Resenias obtenidas correctamente.')));
const getById = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.getReseniaById(req.params.id), 'Resenia obtenida correctamente.')));
const create = asyncHandler(async (req, res) => res.status(201).json(successResponse(await service.createResenia(req.body), 'Resenia creada correctamente.')));
const update = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.updateResenia(req.params.id, req.body), 'Resenia actualizada correctamente.')));
const remove = asyncHandler(async (req, res) => { await service.deleteResenia(req.params.id); res.status(200).json(successResponse(null, 'Resenia eliminada correctamente.')); });

module.exports = { list, getById, create, update, remove };
