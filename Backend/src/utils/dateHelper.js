let timezone = 'America/Guayaquil';
let timezoneOffset = '-05:00';
let loaded = false;

function computeOffset(tz) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'longOffset',
    }).formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart ? tzPart.value.replace('GMT', '') : '-05:00';
  } catch {
    return '-05:00';
  }
}

async function loadTimezone(poolOrGetPool) {
  if (loaded) return;

  try {
    const getPool = typeof poolOrGetPool === 'function' ? poolOrGetPool : null;
    if (!getPool) return;

    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT Zon_Hor_Con FROM configuracion ORDER BY Id_Con ASC LIMIT 1'
    );
    const configTimezone = (rows[0] || {}).Zon_Hor_Con;
    if (configTimezone && typeof configTimezone === 'string' && configTimezone.trim()) {
      timezone = configTimezone.trim();
    }

    timezoneOffset = computeOffset(timezone);
    loaded = true;
  } catch {
    timezoneOffset = computeOffset(timezone);
    loaded = true;
  }
}

function getTimezone() {
  return timezone;
}

function getTimezoneOffset() {
  return timezoneOffset;
}

function toIsoDate(date = new Date()) {
  return new Date(date).toISOString();
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

/**
 * Suma una duracion a una fecha/hora base y devuelve el resultado con el mismo
 * formato local ("YYYY-MM-DD HH:mm:ss") que usa toEcuadorDateTime.
 *
 * La aritmetica se hace por componentes (no en milisegundos) para respetar el
 * calendario: sumar 'meses'/'anios' avanza meses/anios calendario y ajusta el
 * dia cuando el mes destino es mas corto (p. ej. 31-ene + 1 mes => 28/29-feb).
 * La hora del dia se conserva.
 *
 * @param {string|Date} baseDateTime Fecha base (string local o Date).
 * @param {'dias'|'meses'|'anios'} tipo Unidad de la duracion.
 * @param {number} valor Cantidad de unidades a sumar (entero >= 0).
 * @returns {string|null} Fecha resultante en formato local, o null si es invalida.
 */
function addDuration(baseDateTime, tipo, valor) {
  const local = toEcuadorDateTime(baseDateTime);
  if (!local) return null;

  const cantidad = Number(valor);
  if (!Number.isFinite(cantidad)) return local;

  const [datePart, timePart = '00:00:00'] = local.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);

  if (tipo === 'dias') {
    // La suma en UTC evita saltos por horario de verano al normalizar dias.
    const utc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    utc.setUTCDate(utc.getUTCDate() + cantidad);
    return (
      `${utc.getUTCFullYear()}-${pad2(utc.getUTCMonth() + 1)}-${pad2(utc.getUTCDate())} ` +
      `${pad2(utc.getUTCHours())}:${pad2(utc.getUTCMinutes())}:${pad2(utc.getUTCSeconds())}`
    );
  }

  let targetYear = year;
  let targetMonthIndex = month - 1; // 0-based

  if (tipo === 'anios') {
    targetYear += cantidad;
  } else if (tipo === 'meses') {
    const totalMonths = targetMonthIndex + cantidad;
    targetYear += Math.floor(totalMonths / 12);
    targetMonthIndex = ((totalMonths % 12) + 12) % 12;
  } else {
    return local;
  }

  // Ajusta el dia si el mes destino tiene menos dias (dia 0 del mes siguiente = ultimo dia del mes destino).
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, targetMonthIndex + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDayOfTargetMonth);

  return (
    `${targetYear}-${pad2(targetMonthIndex + 1)}-${pad2(targetDay)} ` +
    `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
  );
}

function toEcuadorDateTime(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const values = {};
  for (const p of parts) values[p.type] = p.value;

  const hour = values.hour === '24' ? '00' : values.hour;
  return `${values.year}-${values.month}-${values.day} ${hour}:${values.minute}:${values.second}`;
}

module.exports = { toIsoDate, toEcuadorDateTime, addDuration, loadTimezone, getTimezone, getTimezoneOffset };
