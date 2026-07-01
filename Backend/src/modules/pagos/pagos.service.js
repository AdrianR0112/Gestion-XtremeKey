const pagosRepository = require('./pagos.repository');
const ordenesRepository = require('../ordenes/ordenes.repository');
const { createHttpError } = require('../../utils/entityHelpers');
const { validatePayload, isNumericId } = require('./pagos.validator');

async function ensureOrdenExiste(idOrd) {
  const orden = await ordenesRepository.findById(idOrd);
  if (!orden) {
    throw createHttpError(400, 'La orden indicada no existe.');
  }
}

async function listPagos() {
  return pagosRepository.findAll();
}

async function getPagoById(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Pag invalido.');
  const pago = await pagosRepository.findById(Number(id));
  if (!pago) throw createHttpError(404, 'Pago no encontrado.');
  return pago;
}

async function createPago(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  await ensureOrdenExiste(validation.payload.Id_Ord);
  return pagosRepository.createOne(validation.payload);
}

async function updatePago(id, payload) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Pag invalido.');
  const current = await pagosRepository.findById(Number(id));
  if (!current) throw createHttpError(404, 'Pago no encontrado.');

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);

  await ensureOrdenExiste(validation.payload.Id_Ord ?? current.Id_Ord);
  return pagosRepository.updateById(Number(id), validation.payload);
}

async function deletePago(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Pag invalido.');
  const deleted = await pagosRepository.removeById(Number(id));
  if (!deleted) throw createHttpError(404, 'Pago no encontrado.');
}

module.exports = { listPagos, getPagoById, createPago, updatePago, deletePago };
