const suscripcionesRepository = require('./suscripciones.repository');
const { findClienteByReference, isUuid, resolveClienteInternalId, resolveClienteReference } = require('../clientes/clientes.identity');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const { validatePayload, isNumericId } = require('./suscripciones.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureClienteExiste(idCli) {
  if (idCli === undefined || idCli === null) return null;
  const cliente = await findClienteByReference(idCli);
  if (!cliente) {
    throw createHttpError(400, 'El cliente indicado no existe.');
  }
  return cliente;
}

async function normalizeClienteReference(payload = {}) {
  if (!Object.prototype.hasOwnProperty.call(payload, 'Id_Cli')) {
    return payload;
  }

  if (payload.Id_Cli === null || payload.Id_Cli === '') {
    return { ...payload, Id_Cli: null };
  }

  const clienteReference = await resolveClienteReference(payload.Id_Cli);
  if (!clienteReference) {
    throw createHttpError(400, 'El cliente indicado no existe.');
  }

  return { ...payload, ...clienteReference };
}

async function ensureProductoSuscripcion(idPrd) {
  if (idPrd === undefined || idPrd === null) return null;
  const producto = await productosRepository.findById(idPrd);
  if (!producto) {
    throw createHttpError(400, 'El producto indicado no existe.');
  }
  if (producto.Tip_Prd !== 'suscripcion') {
    throw createHttpError(400, 'El producto indicado no es de tipo suscripcion.');
  }
  return producto;
}

async function ensureVarianteExiste(idVar) {
  if (idVar === undefined || idVar === null) return null;
  const variante = await variantesRepository.findById(idVar);
  if (!variante) {
    throw createHttpError(400, 'La variante indicada no existe.');
  }
  return variante;
}

async function listSuscripciones() {
  return suscripcionesRepository.findAll();
}

async function getSuscripcionById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Sus invalido.');
  }

  const item = await suscripcionesRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Suscripcion no encontrada.');
  }

  return item;
}

async function listSuscripcionesByCliente(clienteId) {
  if (!isNumericId(clienteId) && !isUuid(clienteId)) {
    throw createHttpError(400, 'Identificador de cliente invalido.');
  }

  const resolvedClienteId = await resolveClienteInternalId(clienteId);
  if (!resolvedClienteId) {
    throw createHttpError(404, 'Cliente no encontrado.');
  }

  await ensureClienteExiste(resolvedClienteId);
  return suscripcionesRepository.findByClienteId(resolvedClienteId);
}

async function createSuscripcion(payload) {
  const normalizedPayload = await normalizeClienteReference(payload);
  const validation = validatePayload(normalizedPayload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli);
  await ensureProductoSuscripcion(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);

  return suscripcionesRepository.createOne(validation.payload);
}

async function updateSuscripcion(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Sus invalido.');
  }

  const current = await suscripcionesRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Suscripcion no encontrada.');
  }

  const normalizedPayload = await normalizeClienteReference(payload);
  const validation = validatePayload(normalizedPayload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const merged = {
    ...current,
    ...validation.payload,
  };

  const mergedValidation = validatePayload(merged);
  if (!mergedValidation.isValid) {
    throw createHttpError(400, 'Payload invalido.', mergedValidation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli ?? current.Id_Cli);
  await ensureProductoSuscripcion(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);

  return suscripcionesRepository.updateById(Number(id), validation.payload);
}

async function deleteSuscripcion(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Sus invalido.');
  }

  const deleted = await suscripcionesRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Suscripcion no encontrada.');
  }
}

module.exports = {
  listSuscripciones,
  getSuscripcionById,
  listSuscripcionesByCliente,
  createSuscripcion,
  updateSuscripcion,
  deleteSuscripcion,
};
