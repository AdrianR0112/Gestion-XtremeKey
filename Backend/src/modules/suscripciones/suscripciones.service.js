const suscripcionesRepository = require('./suscripciones.repository');
const { findClienteByReference, resolveClienteInternalId, resolveClienteReference } = require('../clientes/clientes.identity');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const revendedoresRepository = require('../revendedores/revendedores.repository');
const detalleVentasRepository = require('../detalle-ventas/detalleVentas.repository');
const configuracionRepository = require('../configuracion/configuracion.repository');
const plantillasRepository = require('../plantillas-notificacion/plantillasNotificacion.repository');
const {
  buildReminderMensaje,
  buildReminderVariables,
  buildWhatsappSendUrl,
  resolverPlantillaVencimiento,
} = require('../../services/recordatorioMensaje.service');
const { normalizeWhatsappPhone } = require('../../services/vencimientoEmail.service');
const { renovarSuscripcion, renovarSuscripcionesEnLote } = require('./suscripciones.renovacion');
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

async function ensureRevendedorExiste(idRev) {
  if (idRev === undefined || idRev === null) return null;
  const revendedor = await revendedoresRepository.findById(idRev);
  if (!revendedor) {
    throw createHttpError(400, 'El revendedor indicado no existe.');
  }
  return revendedor;
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

const ESTADOS_VALIDOS = ['activa', 'suspendida', 'cancelada', 'expirada'];
// 'archivadas' no es un tramo mas: invierte la exclusion que aplica el listado
// principal, que por defecto oculta lo vencido hace mucho.
const VENCIMIENTOS_VALIDOS = ['por_vencer', 'vencidas', 'vigentes', 'sin_vencimiento', 'archivadas'];

/**
 * Normaliza los query params del listado a los filtros que entiende el
 * repositorio. Lo que no se reconoce se ignora en silencio para que la ruta
 * siga siendo tolerante a params de mas.
 */
function parseFiltros(query = {}) {
  const filtros = {};

  if (query.estado) {
    const estados = String(query.estado)
      .split(',')
      .map((value) => value.trim())
      .filter((value) => ESTADOS_VALIDOS.includes(value));
    if (estados.length > 0) filtros.estado = estados;
  }

  if (query.titular === 'cliente' || query.titular === 'revendedor') {
    filtros.titular = query.titular;
  }

  if (VENCIMIENTOS_VALIDOS.includes(query.vencimiento)) {
    if (query.vencimiento === 'archivadas') {
      filtros.archivadas = true;
    } else {
      filtros.vencimiento = query.vencimiento;
    }
  }

  for (const campo of ['Id_Cli', 'Id_Rev', 'Id_Prd']) {
    const value = Number(query[campo]);
    if (Number.isInteger(value) && value > 0) filtros[campo] = value;
  }

  const dias = Number(query.dias);
  if (Number.isInteger(dias) && dias >= 0) filtros.dias = dias;

  for (const campo of ['desde', 'hasta']) {
    if (query[campo] && !Number.isNaN(new Date(query[campo]).getTime())) {
      filtros[campo] = String(query[campo]).slice(0, 10);
    }
  }

  const q = typeof query.q === 'string' ? query.q.trim() : '';
  if (q) filtros.q = q;

  return filtros;
}

async function listSuscripciones(query = {}) {
  const filtros = parseFiltros(query);
  filtros.diasArchivo = await configuracionRepository.getDiasArchivoVencida();
  return suscripcionesRepository.findAll(filtros);
}

async function getResumenSuscripciones(query = {}) {
  const dias = Number(query.dias);
  const diasArchivo = await configuracionRepository.getDiasArchivoVencida();
  const resumen = await suscripcionesRepository.getResumen(
    Number.isInteger(dias) && dias >= 0 ? dias : 7,
    diasArchivo
  );

  // mysql2 devuelve los SUM() como string o decimal segun el driver.
  return Object.fromEntries(
    Object.entries(resumen).map(([clave, valor]) => [clave, Number(valor || 0)])
  );
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
  if (!isNumericId(clienteId)) {
    throw createHttpError(400, 'Identificador de cliente invalido.');
  }

  const resolvedClienteId = await resolveClienteInternalId(clienteId);
  if (!resolvedClienteId) {
    throw createHttpError(404, 'Cliente no encontrado.');
  }

  await ensureClienteExiste(resolvedClienteId);
  return suscripcionesRepository.findByClienteId(resolvedClienteId);
}

async function listSuscripcionesByRevendedor(revendedorId) {
  if (!isNumericId(revendedorId)) {
    throw createHttpError(400, 'Identificador de revendedor invalido.');
  }

  await ensureRevendedorExiste(Number(revendedorId));
  return suscripcionesRepository.findByRevendedorId(Number(revendedorId));
}

/**
 * Cuando el payload toca el titular, escribe SIEMPRE las dos columnas (la
 * contraria a null). updateById construye el SET dinamicamente, asi que un PUT
 * que solo mandara Id_Rev dejaria el Id_Cli anterior y violaria la CHECK
 * chk_suscripciones_titular.
 */
function applyTitularExclusivo(payload) {
  if (payload.Id_Cli === undefined && payload.Id_Rev === undefined) {
    return payload;
  }

  if (payload.Id_Rev !== undefined && payload.Id_Rev !== null) {
    return { ...payload, Id_Rev: payload.Id_Rev, Id_Cli: null };
  }

  if (payload.Id_Cli !== undefined && payload.Id_Cli !== null) {
    return { ...payload, Id_Cli: payload.Id_Cli, Id_Rev: null };
  }

  return payload;
}

async function createSuscripcion(payload) {
  const normalizedPayload = await normalizeClienteReference(payload);
  const validation = validatePayload(normalizedPayload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli);
  await ensureRevendedorExiste(validation.payload.Id_Rev);
  await ensureProductoSuscripcion(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);

  return suscripcionesRepository.createOne(applyTitularExclusivo(validation.payload));
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

  const cambios = applyTitularExclusivo(validation.payload);

  const merged = {
    ...current,
    ...cambios,
  };

  const mergedValidation = validatePayload(merged);
  if (!mergedValidation.isValid) {
    throw createHttpError(400, 'Payload invalido.', mergedValidation.errors);
  }

  await ensureClienteExiste(cambios.Id_Cli !== undefined ? cambios.Id_Cli : current.Id_Cli);
  await ensureRevendedorExiste(cambios.Id_Rev !== undefined ? cambios.Id_Rev : current.Id_Rev);
  await ensureProductoSuscripcion(cambios.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(cambios.Id_Var ?? current.Id_Var);

  return suscripcionesRepository.updateById(Number(id), cambios);
}

/**
 * Historial de periodos de una suscripcion: el inicial y todas sus renovaciones,
 * con la venta de cada uno. Una suscripcion sin ventas devuelve una lista vacia
 * (es un estado normal: se pudo crear a mano), no un 404.
 */
async function getHistorialSuscripcion(id) {
  const suscripcion = await getSuscripcionById(id);
  const filas = await detalleVentasRepository.findBySuscripcionId(suscripcion.Id_Sus);

  const periodos = filas.map((fila, indice) => ({
    ...fila,
    Num_Per: indice + 1,
    Sub_Tot_Dve: Number(fila.Sub_Tot_Dve || 0),
  }));

  // Hay hueco cuando un periodo empieza despues de que termine el anterior:
  // señal de que la cadena se interrumpio y hubo dias sin cobertura.
  const tieneHuecos = periodos.some((periodo, indice) => {
    if (indice === 0) return false;
    const finAnterior = new Date(periodos[indice - 1].Fec_Fin_Dve);
    const inicioActual = new Date(periodo.Fec_Ini_Dve);
    return inicioActual > finAnterior;
  });

  return {
    periodos,
    resumen: {
      totalPeriodos: periodos.length,
      renovaciones: periodos.filter((periodo) => periodo.Tip_Per === 'renovacion').length,
      montoTotal: Number(periodos.reduce((suma, periodo) => suma + periodo.Sub_Tot_Dve, 0).toFixed(2)),
      primeraFecha: periodos[0]?.Fec_Ini_Dve ?? null,
      ultimaFecha: periodos[periodos.length - 1]?.Fec_Fin_Dve ?? null,
      tieneHuecos,
    },
  };
}

/**
 * Prepara el mensaje de WhatsApp de una suscripcion para enviarlo a mano.
 *
 * Reutiliza la plantilla y el armado de texto de los recordatorios
 * (recordatorioMensaje.service) para que el boton manual y el recordatorio
 * automatico digan exactamente lo mismo. El estado sale de los dias reales que
 * faltan, no de un hito del cron: aqui se pulsa cuando haga falta.
 *
 * Los avisos informan pero no bloquean: quien decide es la persona que pulsa.
 */
async function getMensajeWhatsapp(id) {
  const suscripcion = await getSuscripcionById(id);

  const esRevendedor = suscripcion.Tip_Tit_Sus === 'revendedor';
  const [config, plantilla] = await Promise.all([
    configuracionRepository.findCurrent(),
    resolverPlantillaVencimiento(esRevendedor),
  ]);

  if (!plantilla) {
    throw createHttpError(409, 'No existe una plantilla activa de vencimiento para WhatsApp.');
  }

  const telefono = normalizeWhatsappPhone(suscripcion.Tel_Tit_Sus);
  if (!telefono) {
    throw createHttpError(
      422,
      `${suscripcion.Nom_Tit_Sus || 'El titular'} no tiene un teléfono registrado al que enviar el mensaje.`
    );
  }

  const dias = suscripcion.Dias_Restantes;
  const variables = buildReminderVariables(
    {
      ...suscripcion,
      // El repositorio expone el nombre ya compuesto del titular (cliente o
      // revendedor); la plantilla espera las partes sueltas.
      Nom_Cli: suscripcion.Nom_Tit_Sus,
      Ape_Cli: '',
    },
    dias,
    config
  );

  const mensaje = buildReminderMensaje(plantilla, variables);

  const avisos = [];
  if (suscripcion.Tip_Tit_Sus === 'cliente' && !suscripcion.Ace_Not_What_Cli) {
    avisos.push('El cliente no acepta notificaciones por WhatsApp.');
  }
  if (suscripcion.Id_Var && !suscripcion.Not_Ven_Wsp_Var) {
    avisos.push('La variante tiene desactivados los recordatorios por WhatsApp.');
  }
  if (suscripcion.Est_Sus === 'cancelada') {
    avisos.push('Esta suscripción está cancelada.');
  }
  if (dias === null || dias === undefined) {
    avisos.push('Esta suscripción no tiene fecha de vencimiento.');
  }

  return {
    Id_Sus: suscripcion.Id_Sus,
    titular: {
      nombre: suscripcion.Nom_Tit_Sus || 'Sin nombre',
      tipo: suscripcion.Tip_Tit_Sus,
    },
    telefono,
    servicio: variables.servicio,
    estado: variables.estado,
    diasRestantes: dias ?? null,
    plantilla: { Id_Pla: plantilla.Id_Pla, Nom_Pla: plantilla.Nom_Pla },
    mensaje,
    url: buildWhatsappSendUrl(telefono, mensaje),
    avisos,
  };
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
 * El titular puede ser un cliente final o un revendedor: hay que pasar
 * exactamente uno de clienteRef / revendedorRef.
 *
 * @param {Object} params
 * @param {number|string} [params.clienteRef]    Id_Cli del cliente titular.
 * @param {number} [params.revendedorRef]        Id_Rev del revendedor titular.
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
/** El correo lo dicta el revendedor: se guarda en minusculas y sin espacios. */
function normalizarCorreoCuenta(valor) {
  const correo = String(valor ?? '').trim().toLowerCase();
  return correo || null;
}

async function crearSuscripcionDesdeLinea(params = {}, connection) {
  const {
    clienteRef,
    revendedorRef,
    idProducto,
    idVariante = null,
    fechaInicio,
    fechaFin,
    estado = 'activa',
    renovacionAuto = 1,
    nota = null,
    correoCuenta = null,
  } = params;

  if (idProducto === undefined || idProducto === null) {
    return null;
  }

  const producto = params.producto || (await productosRepository.findById(Number(idProducto)));
  if (!producto || producto.Tip_Prd !== 'suscripcion') {
    return null;
  }

  let idCliente = null;
  let idRevendedor = null;

  if (clienteRef !== undefined && clienteRef !== null && clienteRef !== '') {
    const clienteReference = await resolveClienteReference(clienteRef);
    if (!clienteReference) {
      throw createHttpError(400, 'No se pudo resolver el cliente para registrar la suscripcion.');
    }
    idCliente = clienteReference.Id_Cli;
  } else if (revendedorRef !== undefined && revendedorRef !== null && revendedorRef !== '') {
    const revendedor = await ensureRevendedorExiste(Number(revendedorRef));
    idRevendedor = revendedor.Id_Rev;
  } else {
    throw createHttpError(400, 'No se pudo resolver el titular para registrar la suscripcion.');
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
      Id_Cli: idCliente,
      Id_Rev: idRevendedor,
      Id_Prd: Number(idProducto),
      Id_Var: idVariante !== undefined && idVariante !== null ? Number(idVariante) : null,
      // Cuando el titular es un revendedor, este correo es lo unico que
      // distingue una suscripcion de otra del mismo revendedor.
      Cor_Cue_Sus: normalizarCorreoCuenta(correoCuenta),
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
  getResumenSuscripciones,
  getSuscripcionById,
  listSuscripcionesByCliente,
  listSuscripcionesByRevendedor,
  getHistorialSuscripcion,
  getMensajeWhatsapp,
  renovarSuscripcion,
  renovarSuscripcionesEnLote,
  createSuscripcion,
  updateSuscripcion,
  deleteSuscripcion,
  calcularFechaFinSuscripcion,
  crearSuscripcionDesdeLinea,
  ensureRevendedorExiste,
  ensureProductoSuscripcion,
  ensureVarianteExiste,
};
