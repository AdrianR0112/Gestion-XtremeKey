const service = require('./imagenesProductos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => res.status(200).json(successResponse(await service.listImagenes(), 'Imagenes obtenidas correctamente.')));
const getById = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.getImagenById(req.params.id), 'Imagen obtenida correctamente.')));
const create = asyncHandler(async (req, res) => res.status(201).json(successResponse(await service.createImagen(req.body), 'Imagen creada correctamente.')));
const update = asyncHandler(async (req, res) => res.status(200).json(successResponse(await service.updateImagen(req.params.id, req.body), 'Imagen actualizada correctamente.')));
const remove = asyncHandler(async (req, res) => { await service.deleteImagen(req.params.id); res.status(200).json(successResponse(null, 'Imagen eliminada correctamente.')); });

module.exports = { list, getById, create, update, remove };
