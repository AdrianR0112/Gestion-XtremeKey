const revendedoresRepository = require('./revendedores.repository');
const { validatePayload, isNumericId } = require('./revendedores.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function listRevendedores() {
  return revendedoresRepository.findAll();
}

async function getRevendedorById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Rev invalido.');
  }

  const item = await revendedoresRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Revendedor no encontrado.');
  }

  return item;
}

async function createRevendedor(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return revendedoresRepository.createOne(validation.payload);
}

async function updateRevendedor(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Rev invalido.');
  }

  const current = await revendedoresRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Revendedor no encontrado.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const merged = { ...current, ...validation.payload };
  return revendedoresRepository.updateById(Number(id), merged);
}

async function deleteRevendedor(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Rev invalido.');
  }

  const deleted = await revendedoresRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Revendedor no encontrado.');
  }
}

module.exports = {
  listRevendedores,
  getRevendedorById,
  createRevendedor,
  updateRevendedor,
  deleteRevendedor
};
