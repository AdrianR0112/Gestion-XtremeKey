const cron = require('node-cron');

const { env } = require('../config/env');
const { logger } = require('../config/logger');
const { runVencimientosJob } = require('./vencimientos.job');

let remindersTask = null;

function startJobs() {
  if (!env.remindersEnabled) {
    logger.info('Cron de recordatorios deshabilitado por configuracion.');
    return;
  }

  if (remindersTask) {
    return;
  }

  remindersTask = cron.schedule(env.remindersCron, async () => {
    try {
      const summary = await runVencimientosJob();
      logger.info(`Cron de recordatorios ejecutado: ${summary.sentCount} enviados, ${summary.skippedCount} omitidos, ${summary.errorCount} con error.`);
    } catch (error) {
      logger.error('Error ejecutando cron de recordatorios.', error);
    }
  }, {
    timezone: 'America/Guayaquil'
  });

  logger.info(`Cron de recordatorios inicializado con expresion: ${env.remindersCron}`);
}

module.exports = { startJobs };
