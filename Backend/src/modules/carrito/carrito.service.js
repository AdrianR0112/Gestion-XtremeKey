const carritoRepository = require('./carrito.repository');
const clientesRepository = require('../clientes/clientes.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const { createHttpError } = require('../../utils/entityHelpers');
const { validateSessionPayload, validateItemPayload, validateSessionId, isNumericId } = require('./carrito.validator');

async function ensureClienteExiste(idCli) {
  if (idCli === undefined || idCli === null) return;
  const cliente = await clientesRepository.findById(idCli);
  if (!cliente) {
    throw createHttpError(400, 'El cliente indicado no existe.');
  }
}

async function ensureProductoExiste(idPrd) {
  const producto = await productosRepository.findById(idPrd);
  if (!producto) {
    throw createHttpError(400, 'El producto indicado no existe.');
  }
}

async function ensureVarianteExiste(idVar) {
  if (idVar === undefined || idVar === null) return;
  const variante = await variantesRepository.findById(idVar);
  if (!variante) {
    throw createHttpError(400, 'La variante indicada no existe.');
  }
}

async function listCarritos() {
  return carritoRepository.findAllSessions();
}

async function getCarritoById(id) {
  if (!validateSessionId(id)) {
    throw createHttpError(400, 'Id_Car_Ses invalido.');
  }

  const carrito = await carritoRepository.findSessionById(id);
  if (!carrito) {
    throw createHttpError(404, 'Carrito no encontrado.');
  }

  carrito.items = await carritoRepository.findItemsBySessionId(id);
  return carrito;
}

async function createCarrito(payload) {
  const validation = validateSessionPayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli);
  return carritoRepository.createSession(validation.payload);
}

async function updateCarrito(id, payload) {
  if (!validateSessionId(id)) {
    throw createHttpError(400, 'Id_Car_Ses invalido.');
  }

  const current = await carritoRepository.findSessionById(id);
  if (!current) {
    throw createHttpError(404, 'Carrito no encontrado.');
  }

  const validation = validateSessionPayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli ?? current.Id_Cli);
  return carritoRepository.updateSessionById(id, validation.payload);
}

async function deleteCarrito(id) {
  if (!validateSessionId(id)) {
    throw createHttpError(400, 'Id_Car_Ses invalido.');
  }

  const deleted = await carritoRepository.removeSessionById(id);
  if (!deleted) {
    throw createHttpError(404, 'Carrito no encontrado.');
  }
}

async function listItems(sessionId) {
  await getCarritoById(sessionId);
  return carritoRepository.findItemsBySessionId(sessionId);
}

async function getItemById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Car_Item invalido.');
  }

  const item = await carritoRepository.findItemById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Item de carrito no encontrado.');
  }

  return item;
}

async function createItem(sessionId, payload) {
  await getCarritoById(sessionId);

  const validation = validateItemPayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);
  return carritoRepository.createItem(sessionId, validation.payload);
}

async function updateItem(id, payload) {
  const current = await getItemById(id);

  const validation = validateItemPayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);
  return carritoRepository.updateItemById(Number(id), validation.payload);
}

async function deleteItem(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Car_Item invalido.');
  }

  const deleted = await carritoRepository.removeItemById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Item de carrito no encontrado.');
  }
}

module.exports = {
  listCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  deleteCarrito,
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
