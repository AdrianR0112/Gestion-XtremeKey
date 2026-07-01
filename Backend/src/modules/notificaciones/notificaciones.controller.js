const service = require('./notificaciones.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => res.status(200).json(successResponse(await service.listNotificaciones(), 'Notificaciones obtenidas correctamente.')));
const getById = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.getNotificacionById(req.params.id), 'Notificacion obtenida correctamente.')));
const create = asyncHandler(async (req, res) => res.status(201).json(successResponse(await service.createNotificacion(req.body), 'Notificacion creada correctamente.')));
const update = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.updateNotificacion(req.params.id, req.body), 'Notificacion actualizada correctamente.')));
const remove = asyncHandler(async (req, res) => { await service.deleteNotificacion(req.params.id); res.status(200).json(successResponse(null, 'Notificacion eliminada correctamente.')); });

module.exports = { list, getById, create, update, remove };
