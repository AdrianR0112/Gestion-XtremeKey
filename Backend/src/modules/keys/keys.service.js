const keysRepository = require('./keys.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const proveedoresRepository = require('../proveedores/proveedores.repository');
const { validatePayload, isNumericId } = require('./keys.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
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

async function ensureProveedorExiste(idPro) {
  if (idPro === undefined || idPro === null) return;
  const proveedor = await proveedoresRepository.findById(idPro);
  if (!proveedor) {
    throw createHttpError(400, 'El proveedor indicado no existe.');
  }
}

function validateDateRange(payload) {
  if (!payload.Fec_Com_Key || !payload.Fec_Ven_Key) return;

  const start = new Date(payload.Fec_Com_Key);
  const end = new Date(payload.Fec_Ven_Key);
  if (end < start) {
    throw createHttpError(400, 'Fec_Ven_Key no puede ser menor que Fec_Com_Key.');
  }
}

async function listKeys() {
  return keysRepository.findAll();
}

async function getKeyById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Key invalido.');
  }

  const item = await keysRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Key no encontrada.');
  }

  return item;
}

async function createKey(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  validateDateRange(validation.payload);
  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);
  await ensureProveedorExiste(validation.payload.Id_Pro);

  return keysRepository.createOne(validation.payload);
}

async function updateKey(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Key invalido.');
  }

  const current = await keysRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Key no encontrada.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const merged = {
    ...current,
    ...validation.payload
  };

  const mergedValidation = validatePayload(merged);
  if (!mergedValidation.isValid) {
    throw createHttpError(400, 'Payload invalido.', mergedValidation.errors);
  }

  validateDateRange(merged);
  await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);
  await ensureProveedorExiste(validation.payload.Id_Pro ?? current.Id_Pro);

  return keysRepository.updateById(Number(id), validation.payload);
}

async function deleteKey(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Key invalido.');
  }

  const deleted = await keysRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Key no encontrada.');
  }
}

module.exports = {
  listKeys,
  getKeyById,
  createKey,
  updateKey,
  deleteKey
};
