const cuponesRepository = require('./cupones.repository');
const productosRepository = require('../productos/productos.repository');
const clientesRepository = require('../clientes/clientes.repository');
const ordenesRepository = require('../ordenes/ordenes.repository');
const { createHttpError } = require('../../utils/entityHelpers');
const { validateCouponPayload, validateUsagePayload, isNumericId } = require('./cupones.validator');

async function ensureCouponExists(id) {
  const item = await cuponesRepository.findById(id);
  if (!item) throw createHttpError(404, 'Cupon no encontrado.');
  return item;
}

async function ensureProductExists(id) {
  const producto = await productosRepository.findById(id);
  if (!producto) throw createHttpError(400, 'El producto indicado no existe.');
}

async function ensureClientExists(id) {
  const cliente = await clientesRepository.findById(id);
  if (!cliente) throw createHttpError(400, 'El cliente indicado no existe.');
}

async function ensureOrderExists(id) {
  if (id === undefined || id === null) return;
  const orden = await ordenesRepository.findById(id);
  if (!orden) throw createHttpError(400, 'La orden indicada no existe.');
}

async function ensureCodeAvailable(code, currentId = null) {
  const existing = await cuponesRepository.findByCode(code);
  if (existing && existing.Id_Cup !== currentId) {
    throw createHttpError(409, 'El codigo del cupon ya existe.');
  }
}

async function listCupones() {
  return cuponesRepository.findAll();
}

async function getCuponById(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Cup invalido.');
  const cupon = await ensureCouponExists(Number(id));
  cupon.productos = await cuponesRepository.findProductsByCouponId(Number(id));
  cupon.usos = await cuponesRepository.findUsagesByCouponId(Number(id));
  return cupon;
}

async function createCupon(payload) {
  const validation = validateCouponPayload(payload);
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  await ensureCodeAvailable(validation.payload.Codigo_Cup);
  return cuponesRepository.createOne(validation.payload);
}

async function updateCupon(id, payload) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Cup invalido.');
  const current = await ensureCouponExists(Number(id));
  const validation = validateCouponPayload(payload, { isUpdate: true });
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  await ensureCodeAvailable(validation.payload.Codigo_Cup ?? current.Codigo_Cup, Number(id));
  return cuponesRepository.updateById(Number(id), validation.payload);
}

async function deleteCupon(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Cup invalido.');
  const deleted = await cuponesRepository.removeById(Number(id));
  if (!deleted) throw createHttpError(404, 'Cupon no encontrado.');
}

async function listProductos(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Cup invalido.');
  await ensureCouponExists(Number(id));
  return cuponesRepository.findProductsByCouponId(Number(id));
}

async function addProducto(id, productId) {
  if (!isNumericId(id) || !isNumericId(productId)) {
    throw createHttpError(400, 'Ids invalidos.');
  }
  await ensureCouponExists(Number(id));
  await ensureProductExists(Number(productId));
  try {
    return await cuponesRepository.addProduct(Number(id), Number(productId));
  } catch (error) {
    if (error && (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)) {
      throw createHttpError(409, 'El producto ya esta asociado al cupon.');
    }
    throw error;
  }
}

async function removeProducto(id, productId) {
  if (!isNumericId(id) || !isNumericId(productId)) {
    throw createHttpError(400, 'Ids invalidos.');
  }
  const deleted = await cuponesRepository.removeProduct(Number(id), Number(productId));
  if (!deleted) throw createHttpError(404, 'Relacion cupon-producto no encontrada.');
}

async function listUsages() {
  return cuponesRepository.findUsages();
}

async function getUsageById(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Uso invalido.');
  const usage = await cuponesRepository.findUsageById(Number(id));
  if (!usage) throw createHttpError(404, 'Uso de cupon no encontrado.');
  return usage;
}

async function createUsage(payload) {
  const validation = validateUsagePayload(payload);
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  await ensureCouponExists(validation.payload.Id_Cup);
  await ensureClientExists(validation.payload.Id_Cli);
  await ensureOrderExists(validation.payload.Id_Ord);
  return cuponesRepository.createUsage(validation.payload);
}

async function updateUsage(id, payload) {
  const current = await getUsageById(id);
  const validation = validateUsagePayload(payload, { isUpdate: true });
  if (!validation.isValid) throw createHttpError(400, 'Payload invalido.', validation.errors);
  await ensureCouponExists(validation.payload.Id_Cup ?? current.Id_Cup);
  await ensureClientExists(validation.payload.Id_Cli ?? current.Id_Cli);
  await ensureOrderExists(validation.payload.Id_Ord ?? current.Id_Ord);
  return cuponesRepository.updateUsageById(Number(id), validation.payload);
}

async function deleteUsage(id) {
  if (!isNumericId(id)) throw createHttpError(400, 'Id_Uso invalido.');
  const deleted = await cuponesRepository.removeUsageById(Number(id));
  if (!deleted) throw createHttpError(404, 'Uso de cupon no encontrado.');
}

module.exports = {
  listCupones,
  getCuponById,
  createCupon,
  updateCupon,
  deleteCupon,
  listProductos,
  addProducto,
  removeProducto,
  listUsages,
  getUsageById,
  createUsage,
  updateUsage,
  deleteUsage,
};
