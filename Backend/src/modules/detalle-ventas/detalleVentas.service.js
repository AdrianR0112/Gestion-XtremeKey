const detalleVentasRepository = require('./detalleVentas.repository');
const ventasRepository = require('../ventas/ventas.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const cuentasRepository = require('../cuentas/cuentas.repository');
const keysRepository = require('../keys/keys.repository');
const { validatePayload, isNumericId } = require('./detalleVentas.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureVentaExiste(idVen) {
  if (idVen === undefined || idVen === null) return;
  const venta = await ventasRepository.findById(idVen);
  if (!venta) {
    throw createHttpError(400, 'La venta indicada no existe.');
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

async function ensureCuentaExiste(idCue) {
  if (idCue === undefined || idCue === null) return;
  const cuenta = await cuentasRepository.findById(idCue);
  if (!cuenta) {
    throw createHttpError(400, 'La cuenta indicada no existe.');
  }
}

async function ensureKeyExiste(idKey) {
  if (idKey === undefined || idKey === null) return;
  const key = await keysRepository.findById(idKey);
  if (!key) {
    throw createHttpError(400, 'La key indicada no existe.');
  }
}

async function listDetalleVentas() {
  return detalleVentasRepository.findAll();
}

async function getDetalleVentaById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dve invalido.');
  }

  const item = await detalleVentasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Detalle de venta no encontrado.');
  }

  return item;
}

async function createDetalleVenta(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureVentaExiste(validation.payload.Id_Ven);
  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);
  await ensureCuentaExiste(validation.payload.Id_Cue);
  await ensureKeyExiste(validation.payload.Id_Key);

  return detalleVentasRepository.createOne(validation.payload);
}

async function updateDetalleVenta(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dve invalido.');
  }

  const current = await detalleVentasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Detalle de venta no encontrado.');
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

  await ensureVentaExiste(validation.payload.Id_Ven ?? current.Id_Ven);
  await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);
  await ensureCuentaExiste(validation.payload.Id_Cue ?? current.Id_Cue);
  await ensureKeyExiste(validation.payload.Id_Key ?? current.Id_Key);

  return detalleVentasRepository.updateById(Number(id), validation.payload);
}

async function deleteDetalleVenta(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dve invalido.');
  }

  const deleted = await detalleVentasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Detalle de venta no encontrado.');
  }
}

async function listByCliente(clienteId) {
  const id = Number(clienteId);
  if (!Number.isInteger(id) || id <= 0) {
    throw createHttpError(400, 'clienteId invalido.');
  }
  return detalleVentasRepository.findByClienteId(id);
}

module.exports = {
  listDetalleVentas,
  getDetalleVentaById,
  createDetalleVenta,
  updateDetalleVenta,
  deleteDetalleVenta,
  listByCliente,
};
