const gastosRepository = require('./gastos.repository');
const proveedoresRepository = require('../proveedores/proveedores.repository');
const comprasRepository = require('../compras/compras.repository');
const { validatePayload, isNumericId } = require('./gastos.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureProveedorExiste(idPro) {
  if (idPro === undefined || idPro === null) return;
  const proveedor = await proveedoresRepository.findById(idPro);
  if (!proveedor) {
    throw createHttpError(400, 'El proveedor indicado no existe.');
  }
}

async function ensureCompraExiste(idCom) {
  if (idCom === undefined || idCom === null) return;
  const compra = await comprasRepository.findById(idCom);
  if (!compra) {
    throw createHttpError(400, 'La compra indicada no existe.');
  }
}


async function listGastos() {
  return gastosRepository.findAll();
}

async function getGastoById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Gas invalido.');
  }

  const item = await gastosRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Gasto no encontrado.');
  }

  return item;
}

async function createGasto(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureProveedorExiste(validation.payload.Id_Pro);
  await ensureCompraExiste(validation.payload.Id_Com);

  return gastosRepository.createOne(validation.payload);
}

async function updateGasto(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Gas invalido.');
  }

  const current = await gastosRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Gasto no encontrado.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureProveedorExiste(validation.payload.Id_Pro ?? current.Id_Pro);
  await ensureCompraExiste(validation.payload.Id_Com ?? current.Id_Com);

  return gastosRepository.updateById(Number(id), validation.payload);
}

async function deleteGasto(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Gas invalido.');
  }

  const deleted = await gastosRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Gasto no encontrado.');
  }
}

module.exports = {
  listGastos,
  getGastoById,
  createGasto,
  updateGasto,
  deleteGasto
};
