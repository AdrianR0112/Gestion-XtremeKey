const repo = require('./notificaciones.repository');
const { createHttpError } = require('../../utils/entityHelpers');
const { validatePayload, isNumericId } = require('./notificaciones.validator');

async function listNotificaciones() { return repo.findAll(); }
async function getNotificacionById(id) { if (!isNumericId(id)) throw createHttpError(400, 'Id_Not invalido.'); const item = await repo.findById(Number(id)); if (!item) throw createHttpError(404, 'Notificacion no encontrada.'); return item; }
async function createNotificacion(payload) { const validation = validatePayload(payload); if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors); return repo.createOne(validation.payload); }
async function updateNotificacion(id, payload) { await getNotificacionById(id); const validation = validatePayload(payload, { isUpdate: true }); if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors); return repo.updateById(Number(id), validation.payload); }
async function deleteNotificacion(id) { if (!isNumericId(id)) throw createHttpError(400, 'Id_Not invalido.'); const deleted = await repo.removeById(Number(id)); if (!deleted) throw createHttpError(404, 'Notificacion no encontrada.'); }

module.exports = { listNotificaciones, getNotificacionById, createNotificacion, updateNotificacion, deleteNotificacion };
