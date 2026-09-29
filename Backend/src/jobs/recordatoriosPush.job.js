const { getPool } = require('../config/database');
const { env } = require('../config/env');
const { logger } = require('../config/logger');
const configuracionRepository = require('../modules/configuracion/configuracion.repository');
const recordatoriosRepository = require('../modules/recordatorios/recordatorios.repository');
const recordatoriosService = require('../modules/recordatorios/recordatorios.service');
const pushRepository = require('../modules/push/push.repository');
const pushService = require('../modules/push/push.service');
const { toDateOnly } = require('../services/vencimientoEmail.service');
const { toEcuadorDateTime } = require('../utils/dateHelper');

function addDays(baseDate, days) {
  const [year, month, day] = baseDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function localHour(date, timezone) {
  const value = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    hourCycle: 'h23'
  }).format(date);
  return Number(value);
}

async function countActionable(pool, date, milestone = 'dia') {
  const rows = await recordatoriosRepository.findSuscripcionesPorVencer(pool, date, milestone);
  return rows.filter((row) => !recordatoriosService.ruleSkipReason(row)).length;
}

function buildPayload(today, totalHoy, totalProximas, diasAnticipacion) {
  const title = totalHoy === 0
    ? `${totalProximas} suscripciones próximas a vencer`
    : totalHoy === 1
      ? '1 suscripción vence hoy'
      : `${totalHoy} suscripciones vencen hoy`;
  const body = totalProximas > 0
    ? `Y ${totalProximas} más en los próximos ${diasAnticipacion} días. Toca para enviar los recordatorios.`
    : 'Toca para enviar los recordatorios por WhatsApp.';
  return {
    title,
    body,
    tag: `recordatorios-${today}`,
    renotify: true,
    requireInteraction: true,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    data: { url: `/recordatorios?fecha=${today}&hito=dia`, totalHoy, totalProximas },
    actions: [
      { action: 'abrir', title: 'Ver y enviar' },
      { action: 'omitir', title: 'Ahora no' }
    ]
  };
}

async function runRecordatoriosPushJob(options = {}) {
  const pool = getPool();
  const now = new Date();
  const today = toDateOnly(now);
  const config = await configuracionRepository.getConfiguracionNotificaciones();
  const dryRun = options.dryRun ?? env.pushDryRun;
  const summary = {
    now: toEcuadorDateTime(now), today, timezone: config.timezone,
    configuredHour: config.hora, daysAhead: config.diasAnticipacion, dryRun,
    skippedByHour: false, totalHoy: 0, totalProximas: 0,
    processedCount: 0, sentCount: 0, skippedCount: 0, prunedCount: 0, errorCount: 0,
    items: []
  };

  if (!options.force && localHour(now, config.timezone) !== config.hora) {
    summary.skippedByHour = true;
    return summary;
  }

  summary.totalHoy = await countActionable(pool, today, 'dia');
  for (let offset = 1; offset <= config.diasAnticipacion; offset += 1) {
    summary.totalProximas += await countActionable(pool, addDays(today, offset), 'dia');
  }

  if (summary.totalHoy === 0 && summary.totalProximas === 0) return summary;

  const devices = await pushRepository.findTodasActivas(pool);
  summary.processedCount = devices.length;
  if (dryRun) {
    summary.skippedCount = devices.length;
    summary.items = devices.map((device) => ({ id: device.Id_Psh, status: 'preview' }));
    return summary;
  }

  const payload = buildPayload(today, summary.totalHoy, summary.totalProximas, config.diasAnticipacion);
  for (const device of devices) {
    const reservation = await pushRepository.reserveDailyNotice({
      fechaObjetivo: today,
      idPush: device.Id_Psh,
      totalHoy: summary.totalHoy,
      totalProximas: summary.totalProximas
    }, pool);
    if (!reservation.reserved) {
      summary.skippedCount += 1;
      summary.items.push({ id: device.Id_Psh, status: 'duplicate' });
      continue;
    }

    const delivery = await pushService.notificarUsuarios(payload, { suscripciones: [device] });
    const item = delivery.items[0];
    if (item?.status === 'sent') {
      summary.sentCount += 1;
      await pushRepository.updateDailyNotice(reservation.id, 'enviado', null, pool);
    } else if (item?.status === 'pruned') {
      summary.prunedCount += 1;
      await pushRepository.updateDailyNotice(reservation.id, 'omitido', item.error || 'Endpoint expirado.', pool);
    } else {
      summary.errorCount += 1;
      await pushRepository.updateDailyNotice(reservation.id, 'error', item?.error || 'No se pudo enviar.', pool);
    }
    summary.items.push(item || { id: device.Id_Psh, status: 'error' });
  }

  logger.info(
    `Recordatorios push: ${summary.sentCount} enviados, ${summary.skippedCount} omitidos, ` +
    `${summary.prunedCount} eliminados y ${summary.errorCount} con error.`
  );
  return summary;
}

module.exports = { addDays, localHour, buildPayload, runRecordatoriosPushJob };
