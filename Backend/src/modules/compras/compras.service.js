const comprasRepository = require('./compras.repository');
const proveedoresRepository = require('../proveedores/proveedores.repository');
const { validatePayload, isNumericId } = require('./compras.validator');

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

async function listCompras() {
  return comprasRepository.findAll();
}

async function getCompraById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Com invalido.');
  }

  const item = await comprasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Compra no encontrada.');
  }

  return item;
}

async function createCompra(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureProveedorExiste(validation.payload.Id_Pro);

  return comprasRepository.createOne(validation.payload);
}

async function updateCompra(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Com invalido.');
  }

  const current = await comprasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Compra no encontrada.');
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

  await ensureProveedorExiste(validation.payload.Id_Pro ?? current.Id_Pro);

  return comprasRepository.updateById(Number(id), validation.payload);
}

async function deleteCompra(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Com invalido.');
  }

  const deleted = await comprasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Compra no encontrada.');
  }
}

module.exports = {
  listCompras,
  getCompraById,
  createCompra,
  updateCompra,
  deleteCompra
};
