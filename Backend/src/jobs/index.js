const cron = require('node-cron');

const { env } = require('../config/env');
const { logger } = require('../config/logger');
const { runVencimientosJob } = require('./vencimientos.job');
const { runNotificacionesSuscripcionJob } = require('./suscripcionesTelegram.job');
const { runExpirarSuscripcionesJob } = require('./suscripcionesExpiracion.job');

let remindersTask = null;
let telegramTask = null;
let expiracionTask = null;

function startJobs() {
  if (!env.remindersEnabled) {
    logger.info('Cron de recordatorios deshabilitado por configuracion.');
  } else if (!remindersTask) {
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

  // Sin el else, un return aqui impediria registrar cualquier cron posterior.
  if (!env.telegramEnabled) {
    logger.info('Cron de Telegram deshabilitado por configuracion.');
  } else if (!telegramTask) {
    telegramTask = cron.schedule(env.telegramCron, async () => {
      try {
        const summary = await runNotificacionesSuscripcionJob();
        logger.info(`Cron de Telegram ejecutado: ${summary.sentCount} enviados, ${summary.skippedCount} omitidos, ${summary.errorCount} con error.`);
      } catch (error) {
        logger.error('Error ejecutando cron de Telegram.', error);
      }
    }, {
      timezone: 'America/Guayaquil'
    });

    logger.info(`Cron de Telegram inicializado con expresion: ${env.telegramCron}`);
  }

  if (!env.expiracionEnabled) {
    logger.info('Cron de expiracion de suscripciones deshabilitado por configuracion.');
  } else if (!expiracionTask) {
    expiracionTask = cron.schedule(env.expiracionCron, async () => {
      try {
        const summary = await runExpirarSuscripcionesJob();
        logger.info(`Cron de expiracion ejecutado: ${summary.actualizadas} suscripcion(es) marcadas como expiradas de ${summary.candidatos} candidata(s).`);
      } catch (error) {
        logger.error('Error ejecutando cron de expiracion de suscripciones.', error);
      }
    }, {
      timezone: 'America/Guayaquil'
    });

    logger.info(`Cron de expiracion de suscripciones inicializado con expresion: ${env.expiracionCron}`);
  }
}

module.exports = { startJobs };
