const { getPool } = require('../config/database');
const { env } = require('../config/env');
const { logger } = require('../config/logger');
const { toDateOnly, toEcuadorDateTime } = require('../services/vencimientoEmail.service');
const telegramRepository = require('../modules/telegram/telegram.repository');
const telegramService = require('../modules/telegram/telegram.service');

function addDays(baseDate, days) {
  const [year, month, day] = baseDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function runNotificacionesSuscripcionJob(options = {}) {
  const pool = getPool();
  const today = toDateOnly(new Date());
  const dryRun = options.dryRun ?? env.telegramDryRun;
  const requestedMilestone = options.milestone ? telegramService.normalizeMilestone(options.milestone) : null;
  const entries = [
    { fecha: addDays(today, 5), milestone: 'pre_5' },
    { fecha: addDays(today, 1), milestone: 'pre_1' },
    { fecha: today, milestone: 'dia' }
  ].filter((entry) => !requestedMilestone || entry.milestone === requestedMilestone);
  const summary = {
    now: toEcuadorDateTime(new Date()),
    today,
    dryRun,
    processedCount: 0,
    sentCount: 0,
    skippedCount: 0,
    errorCount: 0,
    previewCount: 0,
    items: []
  };

  for (const entry of entries) {
    const rows = await telegramRepository.findSuscripcionesPorVencer(pool, entry.fecha);
    for (const row of rows) {
      const result = await telegramService.procesarRecordatorio(row, entry.milestone, entry.fecha, {
        pool,
        dryRun,
        forceResend: Boolean(options.forceResend)
      });

      summary.processedCount += 1;
      if (result.status === 'sent') summary.sentCount += 1;
      if (result.status === 'skipped') summary.skippedCount += 1;
      if (result.status === 'error') summary.errorCount += 1;
      if (result.status === 'preview') summary.previewCount += 1;
      summary.items.push({
        subscriptionId: row.Id_Sus,
        clientId: row.Id_Cli,
        milestone: entry.milestone,
        targetDate: entry.fecha,
        clientName: [row.Nom_Cli, row.Ape_Cli].filter(Boolean).join(' '),
        serviceName: row.Nom_Prd,
        variantName: row.Nom_Var,
        status: result.status,
        reason: result.reason || null,
        mensaje: result.mensaje || null,
        adminText: result.adminText || null,
        whatsappUrl: result.whatsappUrl || null,
        telegramMessageId: result.telegramMessageId || null
      });
    }
  }

  logger.info(
    `Recordatorios Telegram: ${summary.sentCount} enviados, ${summary.previewCount} previsualizados, ${summary.skippedCount} omitidos y ${summary.errorCount} con error.`
  );
  return summary;
}

module.exports = { addDays, runNotificacionesSuscripcionJob };
