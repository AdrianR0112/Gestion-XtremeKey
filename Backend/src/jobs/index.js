const cron = require('node-cron');

const { env } = require('../config/env');
const { logger } = require('../config/logger');
const { runVencimientosJob } = require('./vencimientos.job');
<<<<<<< Updated upstream

let remindersTask = null;
=======
const { runRecordatoriosPushJob } = require('./recordatoriosPush.job');
const { runExpirarSuscripcionesJob } = require('./suscripcionesExpiracion.job');

let remindersTask = null;
let pushTask = null;
let expiracionTask = null;
>>>>>>> Stashed changes

function startJobs() {
  if (!env.remindersEnabled) {
    logger.info('Cron de recordatorios deshabilitado por configuracion.');
<<<<<<< Updated upstream
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
=======
  } else if (!remindersTask) {
    remindersTask = cron.schedule(env.remindersCron, async () => {
      try {
        const summary = await runVencimientosJob();
        logger.info(`Cron de recordatorios ejecutado: ${summary.sentCount} enviados, ${summary.skippedCount} omitidos, ${summary.errorCount} con error.`);
      } catch (error) {
        logger.error('Error ejecutando cron de recordatorios.', error);
      }
    }, {
      timezone: env.cronTimezone
    });

    logger.info(`Cron de recordatorios inicializado con expresion: ${env.remindersCron}`);
  }

  // Sin el else, un return aqui impediria registrar cualquier cron posterior.
  if (!env.pushCronEnabled) {
    logger.info('Cron de recordatorios push deshabilitado por configuracion.');
  } else if (!pushTask) {
    pushTask = cron.schedule(env.pushCron, async () => {
      try {
        const summary = await runRecordatoriosPushJob();
        logger.info(`Cron push ejecutado: ${summary.sentCount} enviados, ${summary.skippedCount} omitidos, ${summary.errorCount} con error.`);
      } catch (error) {
        logger.error('Error ejecutando cron de recordatorios push.', error);
      }
    }, {
      timezone: env.cronTimezone
    });

    logger.info(`Cron de recordatorios push inicializado con expresion: ${env.pushCron}`);
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
      timezone: env.cronTimezone
    });
>>>>>>> Stashed changes

  logger.info(`Cron de recordatorios inicializado con expresion: ${env.remindersCron}`);
}

module.exports = { startJobs };
