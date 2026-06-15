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

module.exports = { toIsoDate, toEcuadorDateTime, loadTimezone, getTimezone, getTimezoneOffset };
