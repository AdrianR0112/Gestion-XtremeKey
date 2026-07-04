const ordenesRepository = require('./ordenes.repository');
const clientesRepository = require('../clientes/clientes.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const keysRepository = require('../keys/keys.repository');
const cuentasRepository = require('../cuentas/cuentas.repository');
const cuponesRepository = require('../cupones/cupones.repository');
const suscripcionesService = require('../suscripciones/suscripciones.service');
const { findOrCreateClienteByCorreo } = require('../clientes/clientes.identity');
const { createHttpError } = require('../../utils/entityHelpers');
const { validateOrderPayload, validateOrderItemPayload, isNumericId } = require('./ordenes.validator');

async function ensureClienteExiste(idCli) {
  if (idCli === undefined || idCli === null) return;
  const cliente = await clientesRepository.findById(idCli);
  if (!cliente) throw createHttpError(400, 'El cliente indicado no existe.');
}

async function ensureCuponExiste(idCup) {
  if (idCup === undefined || idCup === null) return;
  const cupon = await cuponesRepository.findById(idCup);
  if (!cupon) throw createHttpError(400, 'El cupon indicado no existe.');
}

async function ensureProductoExiste(idPrd) {
  const producto = await productosRepository.findById(idPrd);
  if (!producto) throw createHttpError(400, 'El producto indicado no existe.');
}

async function ensureVarianteExiste(idVar) {
  if (idVar === undefined || idVar === null) return;
  const variante = await variantesRepository.findById(idVar);
  if (!variante) throw createHttpError(400, 'La variante indicada no existe.');
}

async function ensureKeyExiste(idKey) {
  if (idKey === undefined || idKey === null) return;
  const key = await keysRepository.findById(idKey);
  if (!key) throw createHttpError(400, 'La key indicada no existe.');
}

async function ensureCuentaExiste(idCue) {
  if (idCue === undefined || idCue === null) return;
  const cuenta = await cuentasRepository.findById(idCue);
  if (!cuenta) throw createHttpError(400, 'La cuenta indicada no existe.');
}

async function ensureNumeroDisponible(numeroOrd, currentId = null) {
  if (!numeroOrd) return;
  const existing = await ordenesRepository.findByNumber(numeroOrd);
  if (existing && existing.Id_Ord !== currentId) {
    throw createHttpError(409, 'El numero de orden ya existe.');
  }
}

async function listOrdenes() {
  return ordenesRepository.findAll();
}

async function listOrdenesByCliente(idCli) {
  if (!isNumericId(idCli)) return [];
  return ordenesRepository.findAllByCliente(Number(idCli));
}

async function getOrdenById(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Ord invalido.');

  const orden = await ordenesRepository.findById(Number(id));
  if (!orden) throw createHttpError(404, 'Orden no encontrada.');

  orden.items = await ordenesRepository.findItemsByOrderId(Number(id));
  return orden;
}

async function createOrden(payload) {
  const validation = validateOrderPayload(payload);
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);

  await ensureClienteExiste(validation.payload.Id_Cli);
  await ensureCuponExiste(validation.payload.Id_Cupon);
  await ensureNumeroDisponible(validation.payload.Numero_Ord);
  return ordenesRepository.createOne(validation.payload);
}

async function updateOrden(id, payload) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Ord invalido.');

  const current = await ordenesRepository.findById(Number(id));
  if (!current) throw createHttpError(404, 'Orden no encontrada.');

  const validation = validateOrderPayload(payload, { isUpdate: true });
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);

  await ensureClienteExiste(validation.payload.Id_Cli ?? current.Id_Cli);
  await ensureCuponExiste(validation.payload.Id_Cupon ?? current.Id_Cupon);
  await ensureNumeroDisponible(validation.payload.Numero_Ord ?? current.Numero_Ord, Number(id));
  return ordenesRepository.updateById(Number(id), validation.payload);
}

async function deleteOrden(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Ord invalido.');
  const deleted = await ordenesRepository.removeById(Number(id));
  if (!deleted) throw createHttpError(404, 'Orden no encontrada.');
}

async function listItems(orderId) {
  await getOrdenById(orderId);
  return ordenesRepository.findItemsByOrderId(Number(orderId));
}

async function getItemById(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Item_Ord invalido.');

  const item = await ordenesRepository.findItemById(Number(id));
  if (!item) throw createHttpError(404, 'Item de orden no encontrado.');
  return item;
}

async function createItem(orderId, payload) {
  const orden = await getOrdenById(orderId);

  const validation = validateOrderItemPayload(payload);
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);

  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);
  await ensureKeyExiste(validation.payload.Id_Key);
  await ensureCuentaExiste(validation.payload.Id_Cue);

  const item = await ordenesRepository.createItem(Number(orderId), validation.payload);

  // Si el item corresponde a un producto de tipo suscripcion, registra la
  // suscripcion del cliente de la orden (compra desde el ecommerce).
  await registrarSuscripcionOrdenSiAplica(orden, item);

  return item;
}

/**
 * Resuelve el cliente asociado a una orden de ecommerce. Usa Id_Cli si la orden
 * pertenece a un cliente autenticado; si es compra de invitado, resuelve/crea el
 * cliente por el correo (Email_Invitado) con origen 'ecommerce'. Devuelve una
 * referencia (Id_Cli o Uuid_Cli) o null si no hay forma de identificar al cliente.
 */
async function resolveClienteRefDeOrden(orden) {
  if (orden.Id_Cli) return orden.Id_Cli;

  const correo = String(orden.Email_Invitado ?? '').trim().toLowerCase();
  if (!correo) return null;

  const { cliente } = await findOrCreateClienteByCorreo({
    correo,
    nombre: orden.Notas_Cliente || undefined,
    origen: 'ecommerce',
  });

  return cliente?.Uuid_Cli || cliente?.Id_Cli || null;
}

/**
 * Crea una suscripcion a partir de un item de orden cuando el producto es de tipo
 * 'suscripcion'. La duracion se toma de la variante comprada. No-op si no aplica o
 * si no se puede identificar al cliente de la orden.
 */
async function registrarSuscripcionOrdenSiAplica(orden, item) {
  if (!orden || !item || !item.Id_Prd) return null;

  const producto = await productosRepository.findById(Number(item.Id_Prd));
  if (!producto || producto.Tip_Prd !== 'suscripcion') return null;

  const clienteRef = await resolveClienteRefDeOrden(orden);
  if (!clienteRef) return null;

  return suscripcionesService.crearSuscripcionDesdeLinea({
    clienteRef,
    idProducto: item.Id_Prd,
    idVariante: item.Id_Var ?? null,
    fechaInicio: item.Fec_Ini_Licencia || undefined,
    fechaFin: item.Fec_Fin_Licencia || null,
    producto,
    nota: `Ecommerce · orden ${orden.Numero_Ord}`,
  });
}

async function updateItem(id, payload) {
  const current = await getItemById(id);

  const validation = validateOrderItemPayload(payload, { isUpdate: true });
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);

  await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);
  await ensureKeyExiste(validation.payload.Id_Key ?? current.Id_Key);
  await ensureCuentaExiste(validation.payload.Id_Cue ?? current.Id_Cue);
  return ordenesRepository.updateItemById(Number(id), validation.payload);
}

async function deleteItem(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Item_Ord invalido.');
  const deleted = await ordenesRepository.removeItemById(Number(id));
  if (!deleted) throw createHttpError(404, 'Item de orden no encontrado.');
}

module.exports = {
  listOrdenes,
  listOrdenesByCliente,
  getOrdenById,
  createOrden,
  updateOrden,
  deleteOrden,
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
