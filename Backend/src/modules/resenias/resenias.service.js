const reseniasRepository = require('./resenias.repository');
const clientesRepository = require('../clientes/clientes.repository');
const productosRepository = require('../productos/productos.repository');
const ordenesRepository = require('../ordenes/ordenes.repository');
const { createHttpError } = require('../../utils/entityHelpers');
const { validatePayload, isNumericId } = require('./resenias.validator');

async function ensureExists(repo, id, label) {
  const item = await repo.findById(id);
  if (!item) throw createHttpError(400, `El ${label} indicado no existe.`);
}

async function listResenias() { return reseniasRepository.findAll(); }
async function getReseniaById(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Res invalido.');
  const item = await reseniasRepository.findById(Number(id));
  if (!item) throw createHttpError(404, 'Resenia no encontrada.');
  return item;
}
async function createResenia(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  await ensureExists(clientesRepository, validation.payload.Id_Cli, 'cliente');
  await ensureExists(productosRepository, validation.payload.Id_Prd, 'producto');
  await ensureExists(ordenesRepository, validation.payload.Id_Ord, 'orden');
  const orderItem = await ordenesRepository.findItemById(validation.payload.Id_Item_Ord);
  if (!orderItem) throw createHttpError(400, 'El item de orden indicado no existe.');
  return reseniasRepository.createOne(validation.payload);
}
async function updateResenia(id, payload) {
  const current = await getReseniaById(id);
  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  await ensureExists(clientesRepository, validation.payload.Id_Cli ?? current.Id_Cli, 'cliente');
  await ensureExists(productosRepository, validation.payload.Id_Prd ?? current.Id_Prd, 'producto');
  await ensureExists(ordenesRepository, validation.payload.Id_Ord ?? current.Id_Ord, 'orden');
  const itemId = validation.payload.Id_Item_Ord ?? current.Id_Item_Ord;
  const orderItem = await ordenesRepository.findItemById(itemId);
  if (!orderItem) throw createHttpError(400, 'El item de orden indicado no existe.');
  return reseniasRepository.updateById(Number(id), validation.payload);
}
async function deleteResenia(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Res invalido.');
  const deleted = await reseniasRepository.removeById(Number(id));
  if (!deleted) throw createHttpError(404, 'Resenia no encontrada.');
}

module.exports = { listResenias, getReseniaById, createResenia, updateResenia, deleteResenia };
