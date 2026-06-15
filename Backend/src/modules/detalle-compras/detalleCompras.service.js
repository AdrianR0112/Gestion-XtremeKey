const detalleComprasRepository = require('./detalleCompras.repository');
const comprasRepository = require('../compras/compras.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const { validatePayload, isNumericId } = require('./detalleCompras.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureCompraExiste(idCom) {
  if (idCom === undefined || idCom === null) return;
  const compra = await comprasRepository.findById(idCom);
  if (!compra) {
    throw createHttpError(400, 'La compra indicada no existe.');
  }
}

async function ensureProductoExiste(idPrd) {
  if (idPrd === undefined || idPrd === null) return;
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

async function listDetalleCompras() {
  return detalleComprasRepository.findAll();
}

async function getDetalleCompraById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dco invalido.');
  }

  const item = await detalleComprasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Detalle de compra no encontrado.');
  }

  return item;
}

async function createDetalleCompra(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureCompraExiste(validation.payload.Id_Com);
  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);

  return detalleComprasRepository.createOne(validation.payload);
}

async function updateDetalleCompra(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dco invalido.');
  }

  const current = await detalleComprasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Detalle de compra no encontrado.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const merged = {
    ...current,
    ...validation.payload
  };

  const mergedValidation = validatePayload(merged, { isUpdate: true });
  if (!mergedValidation.isValid) {
    throw createHttpError(400, 'Payload invalido.', mergedValidation.errors);
  }

  await ensureCompraExiste(validation.payload.Id_Com ?? current.Id_Com);
  await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);

  return detalleComprasRepository.updateById(Number(id), validation.payload);
}

async function deleteDetalleCompra(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dco invalido.');
  }

  const deleted = await detalleComprasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Detalle de compra no encontrado.');
  }
}

module.exports = {
  listDetalleCompras,
  getDetalleCompraById,
  createDetalleCompra,
  updateDetalleCompra,
  deleteDetalleCompra
};
