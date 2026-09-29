const { toEcuadorDateTime } = require('../../utils/dateHelper');
const { z } = require('../../utils/zod');

const PERIODOS = ['hoy', 'semana', 'mes', 'trimestre', 'anio'];
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const dashboardQuerySchema = z.object({
  periodo: z.preprocess(
    (value) => (value === undefined || value === '' ? 'mes' : String(value).toLowerCase()),
    z.enum(PERIODOS)
  ),
  ancla: z.preprocess(
    (value) => (value === undefined || value === '' ? 0 : Number(value)),
    z.number().int().min(-60).max(0)
  ),
}).passthrough();

function pad(value) {
  return String(value).padStart(2, '0');
}

function createUtcDate(year, monthIndex, day) {
  return new Date(Date.UTC(year, monthIndex, day));
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDate(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function formatDayLabel(date) {
  return `${date.getUTCDate()} de ${MESES[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
}

function formatWeekLabel(desde, hasta) {
  const mismoAnio = desde.getUTCFullYear() === hasta.getUTCFullYear();
  const mismoMes = mismoAnio && desde.getUTCMonth() === hasta.getUTCMonth();

  if (mismoMes) {
    return `${desde.getUTCDate()}–${hasta.getUTCDate()} ${MESES_CORTOS[hasta.getUTCMonth()]} ${hasta.getUTCFullYear()}`;
  }

  const inicio = `${desde.getUTCDate()} ${MESES_CORTOS[desde.getUTCMonth()]}${mismoAnio ? '' : ` ${desde.getUTCFullYear()}`}`;
  const fin = `${hasta.getUTCDate()} ${MESES_CORTOS[hasta.getUTCMonth()]} ${hasta.getUTCFullYear()}`;
  return `${inicio}–${fin}`;
}

function getNowParts() {
  const nowEc = toEcuadorDateTime(new Date());
  const [year, month, day] = nowEc.slice(0, 10).split('-').map(Number);
  return { year, monthIndex: month - 1, day };
}

function resolverRango(periodo = 'mes', ancla = 0) {
  const { year, monthIndex, day } = getNowParts();
  const hoy = createUtcDate(year, monthIndex, day);
  let desde;
  let hasta;
  let etiqueta;

  if (periodo === 'hoy') {
    desde = addDays(hoy, ancla);
    hasta = desde;
    etiqueta = capitalize(formatDayLabel(desde));
  } else if (periodo === 'semana') {
    const weekday = hoy.getUTCDay();
    const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;
    desde = addDays(hoy, -daysSinceMonday + (ancla * 7));
    hasta = addDays(desde, 6);
    etiqueta = formatWeekLabel(desde, hasta);
  } else if (periodo === 'trimestre') {
    const currentQuarterStart = Math.floor(monthIndex / 3) * 3;
    desde = createUtcDate(year, currentQuarterStart + (ancla * 3), 1);
    hasta = createUtcDate(desde.getUTCFullYear(), desde.getUTCMonth() + 3, 0);
    etiqueta = `T${Math.floor(desde.getUTCMonth() / 3) + 1} ${desde.getUTCFullYear()}`;
  } else if (periodo === 'anio') {
    desde = createUtcDate(year + ancla, 0, 1);
    hasta = createUtcDate(year + ancla, 12, 0);
    etiqueta = String(desde.getUTCFullYear());
  } else {
    desde = createUtcDate(year, monthIndex + ancla, 1);
    hasta = createUtcDate(desde.getUTCFullYear(), desde.getUTCMonth() + 1, 0);
    etiqueta = `${capitalize(MESES[desde.getUTCMonth()])} ${desde.getUTCFullYear()}`;
  }

  return {
    desde: formatDate(desde),
    hasta: formatDate(hasta),
    etiqueta,
  };
}

function resolverRangoAnterior(periodo = 'mes', ancla = 0) {
  return resolverRango(periodo, ancla - 1);
}

function validateQuery(query = {}) {
  const result = dashboardQuerySchema.safeParse(query);
  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.issues.map((issue) => issue.message),
      query: { periodo: 'mes', ancla: 0 },
    };
  }

  return { isValid: true, errors: [], query: result.data };
}

module.exports = {
  PERIODOS,
  dashboardQuerySchema,
  resolverRango,
  resolverRangoAnterior,
  validateQuery,
};
