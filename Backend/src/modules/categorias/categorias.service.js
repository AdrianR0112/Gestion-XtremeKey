const categoriasRepository = require('./categorias.repository');
const { validatePayload, isNumericId } = require('./categorias.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureParentExists(parentId) {
  if (parentId === undefined || parentId === null) return;

  const parent = await categoriasRepository.findById(parentId);
  if (!parent) {
    throw createHttpError(400, 'La categoria padre no existe.');
  }
}

async function listCategorias() {
  return categoriasRepository.findAll();
}

async function getCategoriaById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cat invalido.');
  }

  const item = await categoriasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Categoria no encontrada.');
  }

  return item;
}

async function createCategoria(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureParentExists(validation.payload.Id_Cat_Pad);
  return categoriasRepository.createOne(validation.payload);
}

async function updateCategoria(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cat invalido.');
  }

  const current = await categoriasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Categoria no encontrada.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  if (validation.payload.Id_Cat_Pad !== undefined) {
    if (validation.payload.Id_Cat_Pad === Number(id)) {
      throw createHttpError(400, 'Una categoria no puede ser su propia categoria padre.');
    }

    await ensureParentExists(validation.payload.Id_Cat_Pad);
  }

  return categoriasRepository.updateById(Number(id), validation.payload);
}

async function deleteCategoria(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cat invalido.');
  }

  const deleted = await categoriasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Categoria no encontrada.');
  }
}

module.exports = {
  listCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
