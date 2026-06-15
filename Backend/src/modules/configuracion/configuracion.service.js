const configuracionRepository = require('./configuracion.repository');
const { validatePayload, isNumericId } = require('./configuracion.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function listConfiguraciones() {
  return configuracionRepository.findAll();
}

async function getConfiguracionActual() {
  const item = await configuracionRepository.findCurrent();
  if (!item) {
    throw createHttpError(404, 'No hay configuracion registrada.');
  }

  return item;
}

async function getConfiguracionById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Con invalido.');
  }

  const item = await configuracionRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Configuracion no encontrada.');
  }

  return item;
}

async function createConfiguracion(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return configuracionRepository.createOne(validation.payload);
}

async function updateConfiguracion(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Con invalido.');
  }

  const existing = await configuracionRepository.findById(Number(id));
  if (!existing) {
    throw createHttpError(404, 'Configuracion no encontrada.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return configuracionRepository.updateById(Number(id), validation.payload);
}

async function deleteConfiguracion(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Con invalido.');
  }

  const deleted = await configuracionRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Configuracion no encontrada.');
  }
}

module.exports = {
  listConfiguraciones,
  getConfiguracionActual,
  getConfiguracionById,
  createConfiguracion,
  updateConfiguracion,
  deleteConfiguracion
};
