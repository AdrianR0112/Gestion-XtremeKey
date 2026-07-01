const repo = require('./listaDeseos.repository');
const clientesRepository = require('../clientes/clientes.repository');
const productosRepository = require('../productos/productos.repository');
const { createHttpError } = require('../../utils/entityHelpers');
const { validatePayload, isNumericId } = require('./listaDeseos.validator');

async function ensureExists(repository, id, label) { const item = await repository.findById(id); if (!item) throw createHttpError(400, `El ${label} indicado no existe.`); }
async function listItems() { return repo.findAll(); }
async function getItemById(id) { if (!isNumericId(id)) throw createHttpError(400, 'Id_Des invalido.'); const item = await repo.findById(Number(id)); if (!item) throw createHttpError(404, 'Registro de lista de deseos no encontrado.'); return item; }
async function createItem(payload) {
  const validation = validatePayload(payload); if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  await ensureExists(clientesRepository, validation.payload.Id_Cli, 'cliente');
  await ensureExists(productosRepository, validation.payload.Id_Prd, 'producto');
  try { return await repo.createOne(validation.payload); } catch (error) { if (error && (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)) throw createHttpError(409, 'El producto ya esta en la lista de deseos del cliente.'); throw error; }
}
async function updateItem(id, payload) {
  await getItemById(id);
  const validation = validatePayload(payload, { isUpdate: true }); if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  if (validation.payload.Id_Cli !== undefined) await ensureExists(clientesRepository, validation.payload.Id_Cli, 'cliente');
  if (validation.payload.Id_Prd !== undefined) await ensureExists(productosRepository, validation.payload.Id_Prd, 'producto');
  try { return await repo.updateById(Number(id), validation.payload); } catch (error) { if (error && (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)) throw createHttpError(409, 'El producto ya esta en la lista de deseos del cliente.'); throw error; }
}
async function deleteItem(id) { if (!isNumericId(id)) throw createHttpError(400, 'Id_Des invalido.'); const deleted = await repo.removeById(Number(id)); if (!deleted) throw createHttpError(404, 'Registro de lista de deseos no encontrado.'); }

module.exports = { listItems, getItemById, createItem, updateItem, deleteItem };
