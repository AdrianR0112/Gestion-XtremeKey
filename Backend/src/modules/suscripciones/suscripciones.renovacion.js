const { getPool } = require('../../config/database');
const suscripcionesRepository = require('./suscripciones.repository');
const ventasRepository = require('../ventas/ventas.repository');
const detalleVentasRepository = require('../detalle-ventas/detalleVentas.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const configuracionRepository = require('../configuracion/configuracion.repository');
const {
  calcularInicioPeriodo,
  derivarEstadoSuscripcion,
  resolverInicioPeriodoManual,
} = require('./suscripciones.periodo');
const { toEcuadorDateTime, addDuration } = require('../../utils/dateHelper');

/**
 * Renovacion de suscripciones.
 *
 * Vive en su propio submodulo y depende SOLO de repositorios, nunca de
 * ventas.service: ventas.service ya requiere (via detalleVentas.service) a
 * suscripciones.service, asi que importarlo desde aqui cerraria un ciclo de
 * require. Por el mismo motivo no reutiliza createVentaConDetalles, que ademas
 * abre y cierra su propia transaccion y no admite una conexion externa: la
 * renovacion necesita tocar suscripciones, ventas y detalle_ventas en un unico
 * commit, y el lote necesita agrupar varias suscripciones en una sola venta.
 */

const ESTADOS_VENTA = ['pendiente', 'completada', 'cancelada', 'reembolsada'];
const DURACIONES_VALIDAS = ['dias', 'meses', 'anios'];
const MAX_IDS_LOTE = 100;

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

function isNumericId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

function round2(value) {
  return Number(Number(value).toFixed(2));
}

function resolverDuracion(opciones, variante) {
  const tipo = opciones.Dur_Tip || variante?.Dur_Tip_Var || null;
  const valor = Number(opciones.Dur_Val ?? variante?.Dur_Val_Var);

  if (!DURACIONES_VALIDAS.includes(tipo)) {
    throw createHttpError(
      400,
      'No se pudo determinar la duracion de la renovacion. Indica Dur_Tip (dias, meses o anios) y Dur_Val.'
    );
  }

  if (!Number.isInteger(valor) || valor <= 0) {
    throw createHttpError(400, 'Dur_Val debe ser un entero mayor que cero.');
  }

  return { tipo, valor };
}

function resolverPrecio(opciones, variante, esRevendedor) {
  if (opciones.Pre_Uni !== undefined && opciones.Pre_Uni !== null && opciones.Pre_Uni !== '') {
    const precio = Number(opciones.Pre_Uni);
    if (Number.isNaN(precio) || precio < 0) {
      throw createHttpError(400, 'Pre_Uni debe ser un numero mayor o igual a cero.');
    }
    return round2(precio);
  }

  const sugerido = esRevendedor
    ? variante?.Pre_Rev_Var ?? variante?.Pre_Ven_Var
    : variante?.Pre_Ven_Var;

  return round2(sugerido ?? 0);
}

/**
 * Prepara todo lo que necesita una renovacion sin escribir nada todavia:
 * valida la suscripcion, resuelve producto/variante/duracion/precio y calcula
 * el periodo nuevo. Se ejecuta dentro de la transaccion porque bloquea la fila.
 */
async function prepararRenovacion(idSus, opciones, connection, contexto = {}) {
  const suscripcion = await suscripcionesRepository.findByIdForUpdate(Number(idSus), connection);
  if (!suscripcion) {
    throw createHttpError(404, 'Suscripcion no encontrada.');
  }

  if (suscripcion.Est_Sus === 'cancelada') {
    throw createHttpError(409, 'Una suscripcion cancelada no se renueva: reactivala editandola primero.');
  }

  const esRevendedor = Boolean(suscripcion.Id_Rev);
  if (!suscripcion.Id_Cli && !suscripcion.Id_Rev) {
    throw createHttpError(422, 'La suscripcion no tiene titular (Id_Cli ni Id_Rev). Corrige el registro antes de renovar.');
  }

  // Control optimista contra el doble clic. El FOR UPDATE serializa las dos
  // peticiones, pero la segunda encontraria la suscripcion ya extendida y
  // encadenaria otro periodo perfectamente valido (renovar dos veces seguidas
  // es legitimo). Por eso el cliente manda la fecha de fin que tenia a la
  // vista: si ya no coincide, alguien renovo mientras tanto.
  if (opciones.Fec_Fin_Esperada !== undefined && opciones.Fec_Fin_Esperada !== null) {
    const esperada = toEcuadorDateTime(opciones.Fec_Fin_Esperada);
    const actual = suscripcion.Fec_Fin_Sus ? toEcuadorDateTime(suscripcion.Fec_Fin_Sus) : null;
    if (esperada !== actual) {
      throw createHttpError(
        409,
        'La suscripcion cambio mientras renovabas (ya fue renovada o se edito su vigencia). Recarga y vuelve a intentarlo.'
      );
    }
  }

  const producto = await productosRepository.findById(Number(suscripcion.Id_Prd));
  if (!producto) {
    throw createHttpError(400, 'El producto de la suscripcion ya no existe.');
  }
  if (producto.Tip_Prd !== 'suscripcion') {
    throw createHttpError(400, 'El producto de la suscripcion ya no es de tipo suscripcion.');
  }

  const idVariante = opciones.Id_Var ?? suscripcion.Id_Var ?? null;
  let variante = null;
  if (idVariante !== null && idVariante !== undefined && idVariante !== '') {
    variante = await variantesRepository.findById(Number(idVariante));
    if (!variante) {
      throw createHttpError(400, 'La variante indicada no existe.');
    }
    if (Number(variante.Id_Prd) !== Number(suscripcion.Id_Prd)) {
      throw createHttpError(400, 'La variante indicada no pertenece al producto de la suscripcion.');
    }
  }

  const { tipo, valor } = resolverDuracion(opciones, variante);

  // Por defecto el periodo arranca donde termino el anterior (dentro de la
  // gracia configurada), no el dia en que se hace la renovacion.
  const automatico = calcularInicioPeriodo(suscripcion.Fec_Fin_Sus, {
    graciaDias: contexto.graciaDias,
  });

  let inicio = automatico.inicio;
  if (opciones.Fec_Ini) {
    const inicioManual = resolverInicioPeriodoManual(opciones.Fec_Ini, suscripcion.Fec_Fin_Sus);
    if (!inicioManual.inicio) {
      throw createHttpError(400, 'Fec_Ini no es una fecha valida.');
    }

    // El selector del cliente solo expresa un dia. Si coincide con el dia del
    // vencimiento, resolverInicioPeriodoManual conserva la hora exacta de ese
    // vencimiento para encadenar ambos periodos sin un falso solapamiento.
    const finActual = suscripcion.Fec_Fin_Sus ? toEcuadorDateTime(suscripcion.Fec_Fin_Sus) : null;
    if (finActual && inicioManual.anteriorAlVencimiento) {
      throw createHttpError(
        400,
        `Fec_Ini no puede ser anterior al vencimiento actual (${finActual.slice(0, 10)}): se solaparia con el periodo vigente.`
      );
    }

    inicio = inicioManual.inicio;
  }

  const fin = addDuration(inicio, tipo, valor);

  const ultimoDetalle = await detalleVentasRepository.findLastInChainBySuscripcion(
    suscripcion.Id_Sus,
    connection
  );

  if (ultimoDetalle) {
    const sucesor = await detalleVentasRepository.findByAnteriorId(ultimoDetalle.Id_Dve, connection);
    if (sucesor) {
      throw createHttpError(409, 'El ultimo periodo de esta suscripcion ya tiene una renovacion registrada.');
    }
  }

  const cantidad = Number(opciones.Can ?? 1);
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw createHttpError(400, 'Can debe ser un entero mayor o igual a 1.');
  }

  const precio = resolverPrecio(opciones, variante, esRevendedor);
  const descuento = round2(opciones.Des_Uni ?? 0);
  if (descuento < 0) {
    throw createHttpError(400, 'Des_Uni debe ser mayor o igual a cero.');
  }
  if (descuento > precio) {
    throw createHttpError(400, 'Des_Uni no puede ser mayor que Pre_Uni.');
  }

  return {
    suscripcion,
    producto,
    variante,
    esRevendedor,
    idVariante: idVariante === '' ? null : idVariante,
    ultimoDetalle,
    periodo: {
      inicio,
      fin,
      tipo,
      valor,
      // La UI confirma con esto que el periodo se encadeno desde el
      // vencimiento anterior en vez de arrancar hoy.
      encadenado: opciones.Fec_Ini ? null : automatico.encadenado,
      diasVencida: automatico.diasVencida,
    },
    cobro: {
      cantidad,
      precio,
      descuento,
      subtotal: round2(cantidad * (precio - descuento)),
    },
  };
}

/**
 * Escribe la renovacion ya preparada. Si recibe una venta, cuelga de ella el
 * detalle nuevo; si no, solo extiende la suscripcion.
 */
async function aplicarRenovacion(preparada, venta, opciones, connection) {
  const { suscripcion, idVariante, ultimoDetalle, periodo, cobro } = preparada;

  let detalleCreado = null;

  if (venta) {
    detalleCreado = await detalleVentasRepository.createOne(
      {
        Id_Ven: venta.Id_Ven,
        Id_Dve_Ant: ultimoDetalle?.Id_Dve ?? null,
        Id_Sus: suscripcion.Id_Sus,
        Id_Prd: suscripcion.Id_Prd,
        Id_Var: idVariante ?? null,
        Cor_Cue: opciones.Cor_Cue ?? ultimoDetalle?.Cor_Cue ?? null,
        Con_Cue: opciones.Con_Cue ?? ultimoDetalle?.Con_Cue ?? null,
        Can_Dve: cobro.cantidad,
        Pre_Uni_Dve: cobro.precio,
        Des_Uni_Dve: cobro.descuento,
        Fec_Ini_Dve: periodo.inicio,
        Fec_Fin_Dve: periodo.fin,
        Not_Dve: opciones.Not_Dve ?? null,
        Est_Dve: 'activo',
      },
      connection
    );

    if (ultimoDetalle) {
      await detalleVentasRepository.updateById(ultimoDetalle.Id_Dve, { Est_Dve: 'renovado' }, connection);
    }
  }

  const cambios = {
    Fec_Fin_Sus: periodo.fin,
    // El estado sale de la fecha real: renovar una suscripcion muy atrasada
    // con una duracion corta puede dejar el periodo nuevo aun en el pasado, y
    // marcarla 'activa' seria mentir hasta que corriera el cron nocturno.
    Est_Sus: derivarEstadoSuscripcion(periodo.fin),
  };
  if (idVariante !== undefined) {
    cambios.Id_Var = idVariante ?? null;
  }
  if (opciones.Not_Sus !== undefined) {
    cambios.Not_Sus = opciones.Not_Sus;
  }
  // El revendedor puede reasignar el cupo a otro cliente final al renovar: si
  // manda un correo, la suscripcion pasa a ser de esa cuenta.
  if (opciones.Cor_Cue !== undefined && opciones.Cor_Cue !== null && String(opciones.Cor_Cue).trim() !== '') {
    cambios.Cor_Cue_Sus = String(opciones.Cor_Cue).trim().toLowerCase();
  }

  await suscripcionesRepository.updateById(suscripcion.Id_Sus, cambios, connection);

  return {
    Id_Sus: suscripcion.Id_Sus,
    detalle: detalleCreado,
    detalleAnterior: ultimoDetalle ? { Id_Dve: ultimoDetalle.Id_Dve, Est_Dve: 'renovado' } : null,
    periodo: { ...periodo },
    subtotal: cobro.subtotal,
  };
}

function normalizarDatosVenta(opciones) {
  const estado = opciones.Est_Ven || 'completada';
  if (!ESTADOS_VENTA.includes(estado)) {
    throw createHttpError(400, 'Est_Ven debe ser pendiente, completada, cancelada o reembolsada.');
  }

  const metodoPago = opciones.Met_Pag ?? opciones.Met_Pag_Ven ?? null;
  if (estado === 'completada' && !metodoPago) {
    throw createHttpError(400, 'Met_Pag es obligatorio cuando la venta queda completada.');
  }

  return { estado, metodoPago };
}

async function renovarSuscripcion(id, body = {}) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Sus invalido.');
  }

  const opciones = { ...body };
  const generarVenta = opciones.generarVenta !== false;
  const { estado, metodoPago } = generarVenta
    ? normalizarDatosVenta(opciones)
    : { estado: null, metodoPago: null };

  // Se lee fuera de la transaccion y una sola vez: es configuracion global,
  // no cambia a mitad de la renovacion.
  const graciaDias = await configuracionRepository.getDiasGraciaRenovacion();

  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const preparada = await prepararRenovacion(id, opciones, connection, { graciaDias });

    let venta = null;
    if (generarVenta) {
      venta = await ventasRepository.createOne(
        {
          Id_Cli: preparada.suscripcion.Id_Cli ?? null,
          Id_Rev: preparada.suscripcion.Id_Rev ?? null,
          Fec_Ven: toEcuadorDateTime(new Date()),
          Des_Tot_Ven: 0,
          Imp_Tot_Ven: 0,
          Tot_Ven: preparada.cobro.subtotal,
          Met_Pag_Ven: metodoPago,
          Not_Ven: opciones.Not_Ven ?? null,
          Est_Ven: estado,
        },
        connection
      );
    }

    const resultado = await aplicarRenovacion(preparada, venta, opciones, connection);

    await connection.commit();

    const suscripcionActualizada = await suscripcionesRepository.findById(preparada.suscripcion.Id_Sus);

    return {
      suscripcion: suscripcionActualizada,
      venta: venta
        ? { Id_Ven: venta.Id_Ven, Cod_Ven: venta.Cod_Ven, Tot_Ven: venta.Tot_Ven, Est_Ven: venta.Est_Ven }
        : null,
      detalle: resultado.detalle,
      detalleAnterior: resultado.detalleAnterior,
      periodo: resultado.periodo,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function claveTitular(suscripcion) {
  return suscripcion.Id_Rev ? `R${suscripcion.Id_Rev}` : `C${suscripcion.Id_Cli}`;
}

/**
 * Renueva varias suscripciones a la vez.
 *
 * Por defecto agrupa por titular en una sola venta: cobrarle a un revendedor
 * cuatro suscripciones es una unica operacion de cobro, con un codigo y un
 * total. Cada grupo es atomico (una venta a medias dejaria Tot_Ven descuadrado
 * respecto a sus lineas), pero un grupo que falla no arrastra a los demas: se
 * devuelve un reporte con los exitos y los fallos.
 */
async function renovarSuscripcionesEnLote(body = {}) {
  const idsUnicos = [...new Set((Array.isArray(body.ids) ? body.ids : []).map(Number))];
  const ids = idsUnicos.filter((id) => isNumericId(id));

  if (ids.length === 0) {
    throw createHttpError(400, 'Debes indicar al menos un Id_Sus valido en ids.');
  }
  if (ids.length > MAX_IDS_LOTE) {
    throw createHttpError(400, `No se pueden renovar mas de ${MAX_IDS_LOTE} suscripciones a la vez.`);
  }

  const overrides = body.overrides || {};
  const porItem = body.porItem || {};
  const agrupar = body.agrupar === 'por-suscripcion' ? 'por-suscripcion' : 'por-titular';
  const generarVenta = overrides.generarVenta !== false;

  // Una sola lectura para todo el lote, no una por suscripcion.
  const graciaDias = await configuracionRepository.getDiasGraciaRenovacion();

  const pool = getPool();

  // Los grupos se arman leyendo el titular de cada suscripcion fuera de las
  // transacciones; la validacion real ocurre dentro de cada grupo.
  const grupos = new Map();
  const errores = [];

  for (const id of ids) {
    const suscripcion = await suscripcionesRepository.findById(id);
    if (!suscripcion) {
      errores.push({ Id_Sus: id, statusCode: 404, message: 'Suscripcion no encontrada.' });
      continue;
    }
    if (!suscripcion.Id_Cli && !suscripcion.Id_Rev) {
      errores.push({ Id_Sus: id, statusCode: 422, message: 'La suscripcion no tiene titular.' });
      continue;
    }

    const clave = agrupar === 'por-titular' ? claveTitular(suscripcion) : `S${id}`;
    if (!grupos.has(clave)) grupos.set(clave, []);
    grupos.get(clave).push(id);
  }

  const ventas = [];
  const resultados = [];

  for (const [, idsGrupo] of grupos) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const preparadas = [];
      for (const id of idsGrupo) {
        const opciones = { ...overrides, ...(porItem[id] || porItem[String(id)] || {}) };
        preparadas.push({
          id,
          opciones,
          datos: await prepararRenovacion(id, opciones, connection, { graciaDias }),
        });
      }

      let venta = null;
      if (generarVenta) {
        const { estado, metodoPago } = normalizarDatosVenta(overrides);
        const total = round2(preparadas.reduce((suma, item) => suma + item.datos.cobro.subtotal, 0));
        const primera = preparadas[0].datos.suscripcion;

        venta = await ventasRepository.createOne(
          {
            Id_Cli: primera.Id_Cli ?? null,
            Id_Rev: primera.Id_Rev ?? null,
            Fec_Ven: toEcuadorDateTime(new Date()),
            Des_Tot_Ven: 0,
            Imp_Tot_Ven: 0,
            Tot_Ven: total,
            Met_Pag_Ven: metodoPago,
            Not_Ven: overrides.Not_Ven ?? null,
            Est_Ven: estado,
          },
          connection
        );
      }

      const aplicadas = [];
      for (const item of preparadas) {
        aplicadas.push(await aplicarRenovacion(item.datos, venta, item.opciones, connection));
      }

      await connection.commit();

      if (venta) {
        ventas.push({
          Id_Ven: venta.Id_Ven,
          Cod_Ven: venta.Cod_Ven,
          Id_Cli: venta.Id_Cli,
          Id_Rev: venta.Id_Rev,
          Tot_Ven: venta.Tot_Ven,
          items: aplicadas.length,
        });
      }

      for (const aplicada of aplicadas) {
        resultados.push({
          Id_Sus: aplicada.Id_Sus,
          ok: true,
          Id_Ven: venta?.Id_Ven ?? null,
          Id_Dve: aplicada.detalle?.Id_Dve ?? null,
          Fec_Ini_Per: aplicada.periodo.inicio,
          Fec_Fin_Sus: aplicada.periodo.fin,
          encadenado: aplicada.periodo.encadenado,
        });
      }
    } catch (error) {
      await connection.rollback();
      // El grupo entero se descarta: la venta compartida hace que sus lineas
      // sean indivisibles.
      for (const id of idsGrupo) {
        errores.push({
          Id_Sus: id,
          statusCode: error.statusCode || 500,
          message: error.message || 'Error renovando la suscripcion.',
        });
      }
    } finally {
      connection.release();
    }
  }

  return {
    total: ids.length,
    exitos: resultados.length,
    fallos: errores.length,
    ventas,
    resultados,
    errores,
  };
}

module.exports = {
  renovarSuscripcion,
  renovarSuscripcionesEnLote,
};
