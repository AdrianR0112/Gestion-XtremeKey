const repo = require('./imagenesProductos.repository');
const productosRepository = require('../productos/productos.repository');
const { createHttpError } = require('../../utils/entityHelpers');
const { validatePayload, isNumericId } = require('./imagenesProductos.validator');

async function ensureProductoExiste(id) { const producto = await productosRepository.findById(id); if (!producto) throw createHttpError(400, 'El producto indicado no existe.'); }
async function listImagenes() { return repo.findAll(); }
async function getImagenById(id) { if (!isNumericId(id)) throw createHttpError(400, 'Id_Ima invalido.'); const item = await repo.findById(Number(id)); if (!item) throw createHttpError(404, 'Imagen no encontrada.'); return item; }
async function createImagen(payload) { const validation = validatePayload(payload); if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors); await ensureProductoExiste(validation.payload.Id_Prd); return repo.createOne(validation.payload); }
async function updateImagen(id, payload) { const current = await getImagenById(id); const validation = validatePayload(payload, { isUpdate: true }); if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors); await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd); return repo.updateById(Number(id), validation.payload); }
async function deleteImagen(id) { if (!isNumericId(id)) throw createHttpError(400, 'Id_Ima invalido.'); const deleted = await repo.removeById(Number(id)); if (!deleted) throw createHttpError(404, 'Imagen no encontrada.'); }

module.exports = { listImagenes, getImagenById, createImagen, updateImagen, deleteImagen };
