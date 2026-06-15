const proveedoresRepository = require('./proveedores.repository');
const { validatePayload, isNumericId } = require('./proveedores.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function listProveedores() {
  return proveedoresRepository.findAll();
}

async function getProveedorById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pro invalido.');
  }

  const item = await proveedoresRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Proveedor no encontrado.');
  }

  return item;
}

async function createProveedor(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return proveedoresRepository.createOne(validation.payload);
}

async function updateProveedor(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pro invalido.');
  }

  const current = await proveedoresRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Proveedor no encontrado.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return proveedoresRepository.updateById(Number(id), validation.payload);
}

async function deleteProveedor(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pro invalido.');
  }

  const deleted = await proveedoresRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Proveedor no encontrado.');
  }
}

module.exports = {
  listProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
};
