const suscripcionesRepository = require('./suscripciones.repository');
const { findClienteByReference, isUuid, resolveClienteInternalId, resolveClienteReference } = require('../clientes/clientes.identity');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const { validatePayload, isNumericId } = require('./suscripciones.validator');
const { toEcuadorDateTime, addDuration } = require('../../utils/dateHelper');

const DURACIONES_VALIDAS = ['dias', 'meses', 'anios'];

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

/**
 * Calcula la fecha de fin de una suscripcion a partir de la duracion de la variante.
 * Devuelve null si la variante no define una duracion valida (suscripcion sin vencimiento).
 *
 * @param {string|Date} fechaInicio Fecha de inicio (string local o Date).
 * @param {Object|null} variante    Variante con Dur_Tip_Var / Dur_Val_Var.
 * @returns {string|null} Fecha de fin en formato local, o null.
 */
function calcularFechaFinSuscripcion(fechaInicio, variante) {
  if (!variante) return null;

  const tipo = variante.Dur_Tip_Var;
  const valor = Number(variante.Dur_Val_Var);
  if (!DURACIONES_VALIDAS.includes(tipo) || !Number.isInteger(valor) || valor <= 0) {
    return null;
  }

  return addDuration(fechaInicio, tipo, valor);
}

/**
 * Crea una suscripcion a partir de una linea de venta/orden, SOLO si el producto
 * es de tipo 'suscripcion'. Centraliza la logica para los flujos manual/WhatsApp
 * y ecommerce, de modo que cualquier venta de una suscripcion quede registrada.
 *
 * No lanza si el producto no es suscripcion: simplemente devuelve null (no-op),
 * asi los callers pueden invocarla para toda linea sin ramificar.
 *
 * @param {Object} params
 * @param {number|string} params.clienteRef      Id_Cli o Uuid_Cli del cliente (obligatorio).
 * @param {number} params.idProducto             Id del producto vendido (obligatorio).
 * @param {number|null} [params.idVariante]      Id de la variante vendida (define la duracion).
 * @param {string|Date} [params.fechaInicio]     Inicio de la suscripcion (por defecto: ahora).
 * @param {string|Date|null} [params.fechaFin]   Fin explicito; si se omite se calcula por la variante.
 * @param {'activa'|'suspendida'|'cancelada'|'expirada'} [params.estado='activa']
 * @param {boolean|number} [params.renovacionAuto=1]
 * @param {string|null} [params.nota]
 * @param {Object} [params.producto]             Producto ya cargado (evita re-consulta).
 * @param {Object} [params.variante]             Variante ya cargada (evita re-consulta).
 * @param {import('mysql2/promise').PoolConnection} [connection] Conexion para operar dentro de una transaccion.
 * @returns {Promise<Object|null>} La suscripcion creada, o null si el producto no es suscripcion.
 */
async function crearSuscripcionDesdeLinea(params = {}, connection) {
  const {
    clienteRef,
    idProducto,
    idVariante = null,
    fechaInicio,
    fechaFin,
    estado = 'activa',
    renovacionAuto = 1,
    nota = null,
  } = params;

  if (idProducto === undefined || idProducto === null) {
    return null;
  }

  const producto = params.producto || (await productosRepository.findById(Number(idProducto)));
  if (!producto || producto.Tip_Prd !== 'suscripcion') {
    return null;
  }

  const clienteReference = await resolveClienteReference(clienteRef);
  if (!clienteReference) {
    throw createHttpError(400, 'No se pudo resolver el cliente para registrar la suscripcion.');
  }

  let variante = params.variante ?? null;
  if (!variante && idVariante !== undefined && idVariante !== null) {
    variante = await variantesRepository.findById(Number(idVariante));
  }

  const inicio = toEcuadorDateTime(fechaInicio || new Date());
  const fin = fechaFin !== undefined && fechaFin !== null
    ? toEcuadorDateTime(fechaFin)
    : calcularFechaFinSuscripcion(inicio, variante);

  return suscripcionesRepository.createOne(
    {
      Id_Cli: clienteReference.Id_Cli,
      Uuid_Cli: clienteReference.Uuid_Cli,
      Id_Prd: Number(idProducto),
      Id_Var: idVariante !== undefined && idVariante !== null ? Number(idVariante) : null,
      Fec_Ini_Sus: inicio,
      Fec_Fin_Sus: fin,
      Est_Sus: estado,
      Ren_Auto: renovacionAuto ? 1 : 0,
      Not_Sus: nota,
    },
    connection
  );
}

module.exports = {
  listSuscripciones,
  getSuscripcionById,
  listSuscripcionesByCliente,
  createSuscripcion,
  updateSuscripcion,
  deleteSuscripcion,
  calcularFechaFinSuscripcion,
  crearSuscripcionDesdeLinea,
};
