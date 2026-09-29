const { toEcuadorDateTime } = require('../../utils/dateHelper');

/**
 * Reglas de fecha y estado de un periodo de suscripcion.
 *
 * Vive suelto y solo depende de dateHelper (ni repositorios ni servicios):
 * lo usan tanto la renovacion desde el modulo de suscripciones como la
 * renovacion que llega dentro de una venta (ventas.service), y cualquier
 * dependencia mas pesada cerraria un ciclo de require.
 */

const DEFAULT_DIAS_GRACIA = 30;

/** Medianoche local (Ecuador) del dia de la fecha dada, como Date en UTC. */
function aMedianocheLocal(valor) {
  const local = toEcuadorDateTime(valor);
  if (!local) return null;
  const [year, month, day] = local.split(' ')[0].split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Dias completos que lleva vencida una suscripcion: positivo si la fecha de
 * fin ya paso, 0 el mismo dia del vencimiento, negativo si aun es futura.
 *
 * Se compara por dia calendario y no por instante para que renovar a las 8am
 * y a las 8pm del mismo dia den el mismo resultado.
 */
function diasVencida(fechaFin, ahora = new Date()) {
  const fin = aMedianocheLocal(fechaFin);
  const hoy = aMedianocheLocal(ahora);
  if (!fin || !hoy) return null;
  return Math.round((hoy.getTime() - fin.getTime()) / 86400000);
}

/**
 * Inicio del nuevo periodo de una renovacion.
 *
 * Encadena desde el vencimiento anterior para no dejar huecos de cobertura ni
 * regalar dias ya pagados: si vencia el 1-feb y se renueva el 3-feb, el
 * periodo nuevo va del 1-feb al 1-mar, no del 3-feb al 3-mar.
 *
 * El encadenado se corta pasada la gracia configurada: arrancar en una fecha
 * muy vieja venderia un periodo integramente consumido y dejaria la
 * suscripcion vencida otra vez el mismo dia de renovarla.
 *
 * @returns {{inicio: string, encadenado: boolean, diasVencida: number|null}}
 */
function calcularInicioPeriodo(fechaFinAnterior, opciones = {}) {
  const { graciaDias = DEFAULT_DIAS_GRACIA, ahora = new Date() } = opciones;

  const gracia = Number.isInteger(Number(graciaDias)) && Number(graciaDias) >= 0
    ? Number(graciaDias)
    : DEFAULT_DIAS_GRACIA;

  const finLocal = fechaFinAnterior ? toEcuadorDateTime(fechaFinAnterior) : null;

  // Sin vencimiento previo (suscripcion sin fin, o primer periodo) no hay nada
  // desde donde encadenar.
  if (!finLocal) {
    return { inicio: toEcuadorDateTime(ahora), encadenado: false, diasVencida: null };
  }

  const vencida = diasVencida(finLocal, ahora);

  // vencida <= 0 es renovacion anticipada (aun vigente); 0 < vencida <= gracia
  // es renovacion tardia dentro de la tolerancia. En ambos casos se encadena.
  if (vencida <= gracia) {
    return { inicio: finLocal, encadenado: true, diasVencida: vencida };
  }

  return { inicio: toEcuadorDateTime(ahora), encadenado: false, diasVencida: vencida };
}

/**
 * Resuelve una fecha de inicio elegida desde un control que solo conoce el
 * dia calendario. Las suscripciones guardan DATETIME, asi que comparar los
 * instantes directamente produciria un falso solapamiento cuando, por
 * ejemplo, el control envia el mismo dia a las 12:00 y la vigencia termina a
 * las 20:00.
 *
 * Si ambos valores caen en el mismo dia de Ecuador se usa el vencimiento
 * exacto. Asi el periodo nuevo queda encadenado sin huecos ni solapamientos.
 *
 * @returns {{inicio: string|null, anteriorAlVencimiento: boolean, ajustadoAlVencimiento: boolean}}
 */
function resolverInicioPeriodoManual(fechaInicio, fechaFinActual) {
  const inicio = toEcuadorDateTime(fechaInicio);
  const finActual = fechaFinActual ? toEcuadorDateTime(fechaFinActual) : null;

  if (!inicio || !finActual) {
    return {
      inicio,
      anteriorAlVencimiento: false,
      ajustadoAlVencimiento: false,
    };
  }

  const diaInicio = inicio.slice(0, 10);
  const diaFinActual = finActual.slice(0, 10);

  if (diaInicio < diaFinActual) {
    return {
      inicio,
      anteriorAlVencimiento: true,
      ajustadoAlVencimiento: false,
    };
  }

  if (diaInicio === diaFinActual) {
    return {
      inicio: finActual,
      anteriorAlVencimiento: false,
      ajustadoAlVencimiento: true,
    };
  }

  return {
    inicio,
    anteriorAlVencimiento: false,
    ajustadoAlVencimiento: false,
  };
}

/**
 * Estado que le corresponde a una suscripcion segun su fecha de fin.
 *
 * Se usa en vez de fijar 'activa' al renovar: cuando el periodo nuevo cae en
 * el pasado (renovar una suscripcion muy atrasada con una duracion corta),
 * marcarla activa dejaria un registro incoherente hasta que corriera el cron
 * de medianoche.
 *
 * La comparacion es estricta (vencida solo si el fin es ANTERIOR a hoy), la
 * misma que usa runExpirarSuscripcionesJob, para que ambos no se contradigan
 * el dia del vencimiento.
 */
function derivarEstadoSuscripcion(fechaFin, ahora = new Date()) {
  if (!fechaFin) return 'activa';
  const vencida = diasVencida(fechaFin, ahora);
  if (vencida === null) return 'activa';
  return vencida > 0 ? 'expirada' : 'activa';
}

module.exports = {
  DEFAULT_DIAS_GRACIA,
  calcularInicioPeriodo,
  derivarEstadoSuscripcion,
  diasVencida,
  resolverInicioPeriodoManual,
};
