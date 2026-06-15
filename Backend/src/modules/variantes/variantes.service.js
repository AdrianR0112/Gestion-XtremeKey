const variantesRepository = require('./variantes.repository');
const productosRepository = require('../productos/productos.repository');
const { validatePayload, isNumericId } = require('./variantes.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureProductoExiste(idPrd) {
  if (idPrd === undefined || idPrd === null) return;
  const product = await productosRepository.findById(idPrd);
  if (!product) {
    throw createHttpError(400, 'El producto indicado no existe.');
  }
}

async function listVariantes() {
  return variantesRepository.findAll();
}

async function getVarianteById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Var invalido.');
  }

  const item = await variantesRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Variante no encontrada.');
  }

  return item;
}

async function createVariante(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureProductoExiste(validation.payload.Id_Prd);
  return variantesRepository.createOne(validation.payload);
}

async function updateVariante(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Var invalido.');
  }

  const current = await variantesRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Variante no encontrada.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureProductoExiste(validation.payload.Id_Prd);
  return variantesRepository.updateById(Number(id), validation.payload);
}

async function deleteVariante(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Var invalido.');
  }

  const deleted = await variantesRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Variante no encontrada.');
  }
}

module.exports = {
  listVariantes,
  getVarianteById,
  createVariante,
  updateVariante,
  deleteVariante
};
