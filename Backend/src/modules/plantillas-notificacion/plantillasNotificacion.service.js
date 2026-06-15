const plantillasRepository = require('./plantillasNotificacion.repository');
const { validatePayload, isNumericId } = require('./plantillasNotificacion.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function listPlantillas() {
  return plantillasRepository.findAll();
}

async function getPlantillaById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pla invalido.');
  }

  const item = await plantillasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Plantilla no encontrada.');
  }

  return item;
}

async function createPlantilla(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return plantillasRepository.createOne(validation.payload);
}

async function updatePlantilla(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pla invalido.');
  }

  const current = await plantillasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Plantilla no encontrada.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return plantillasRepository.updateById(Number(id), validation.payload);
}

async function deletePlantilla(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pla invalido.');
  }

  const deleted = await plantillasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Plantilla no encontrada.');
  }
}

module.exports = {
  listPlantillas,
  getPlantillaById,
  createPlantilla,
  updatePlantilla,
  deletePlantilla
};
