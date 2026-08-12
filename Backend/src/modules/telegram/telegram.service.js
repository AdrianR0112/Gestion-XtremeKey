const { getPool } = require('../../config/database');
const { env } = require('../../config/env');
const { logger } = require('../../config/logger');
const plantillasRepository = require('../plantillas-notificacion/plantillasNotificacion.repository');
const configuracionRepository = require('../configuracion/configuracion.repository');
const telegramRepository = require('./telegram.repository');
const { sendMessage } = require('../../services/telegram.service');
const {
  buildAdminTelegramText,
  buildReminderMensaje,
  buildReminderVariables,
  buildWhatsappSendUrl,
  diasDesdeMilestone
} = require('../../services/recordatorioMensaje.service');
const { toDateOnly, toEcuadorDateTime, normalizeWhatsappPhone } = require('../../services/vencimientoEmail.service');

const MILESTONES = ['pre_5', 'pre_1', 'dia'];

function normalizeMilestone(value) {
  if (value === 5 || value === '5' || value === 'pre_5') return 'pre_5';
  if (value === 1 || value === '1' || value === 'pre_1') return 'pre_1';
  if (value === 0 || value === '0' || value === 'dia' || value === 'hoy') return 'dia';
  return value;
}

function getDateForMilestone(today, milestone) {
  const [year, month, day] = today.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + (milestone === 'pre_5' ? 5 : milestone === 'pre_1' ? 1 : 0));
  return date.toISOString().slice(0, 10);
}

function getDateWithOffset(today, offset) {
  const [year, month, day] = today.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

/**
 * Ambas plantillas se cargan una sola vez por corrida; cual se usa depende de
 * cada fila, no del lote.
 */
async function loadMessageContext() {
  const [config, template, templateRevendedor] = await Promise.all([
    configuracionRepository.findCurrent(),
    plantillasRepository.findActivaByTipoCanal('vencimiento', 'whatsapp'),
    plantillasRepository.findActivaByTipoCanal('vencimiento_revendedor', 'whatsapp')
  ]);
  return { config, template, templateRevendedor };
}

/**
 * Un revendedor recibe el aviso en su telefono pero la cuenta es de su cliente
 * final, asi que lleva su propia redaccion. Sin plantilla propia se cae a la
 * general para no dejarlo sin mensaje.
 */
function plantillaDeFila(context, row) {
  const esRevendedor = row.Tip_Tit_Sus === 'revendedor' || Boolean(row.Id_Rev);
  if (esRevendedor && context.templateRevendedor) return context.templateRevendedor;
  return context.template;
}

/**
 * Las variables las arma recordatorioMensaje.service para que el boton manual
 * de suscripciones produzca exactamente el mismo texto. Aqui solo se traduce
 * el hito del cron a dias.
 */
function variablesDeFila(row, milestone, config) {
  return buildReminderVariables(row, diasDesdeMilestone(milestone), config);
}

function ruleSkipReason(row) {
  if (!row.Not_Ven_Wsp_Var) return 'La variante tiene desactivados los recordatorios por WhatsApp.';
  if (!row.Ace_Not_Tel_Cli) return 'El cliente no acepta notificaciones por WhatsApp.';
  if (!normalizeWhatsappPhone(row.Tel_Cli)) return 'El cliente no tiene un teléfono registrado.';
  return '';
}

async function listarPorVencer(milestones = [5, 1, 0]) {
  const today = toDateOnly(new Date());
  const normalized = [...new Set((Array.isArray(milestones) ? milestones : [milestones]).map(normalizeMilestone))]
    .filter((value) => MILESTONES.includes(value));
  const context = await loadMessageContext();
  const items = [];

  for (const milestone of normalized) {
    const fechaObjetivo = getDateForMilestone(today, milestone);
    const rows = await telegramRepository.findSuscripcionesPorVencer(getPool(), fechaObjetivo);
    for (const row of rows) {
      const plantilla = plantillaDeFila(context, row);
      const mensaje = plantilla ? buildReminderMensaje(plantilla, variablesDeFila(row, milestone, context.config)) : '';
      const whatsappUrl = buildWhatsappSendUrl(row.Tel_Cli, mensaje);
      items.push({
        ...row,
        milestone,
        fechaObjetivo,
        status: ruleSkipReason(row) ? 'omitido' : 'disponible',
        reason: ruleSkipReason(row) || null,
        mensaje,
        whatsappUrl,
        adminText: buildAdminTelegramText(row, milestone)
      });
    }
  }

  return { today, milestones: normalized, items };
}

async function listarVencidasAyer() {
  const today = toDateOnly(new Date());
  const fechaObjetivo = getDateWithOffset(today, -1);
  const context = await loadMessageContext();
  const rows = await telegramRepository.findSuscripcionesVencidasAyer(getPool(), fechaObjetivo);
  const items = rows.map((row) => {
    const reason = ruleSkipReason(row);
    const plantilla = plantillaDeFila(context, row);
    const mensaje = plantilla
      ? buildReminderMensaje(plantilla, variablesDeFila(row, 'ayer', context.config))
      : '';
    return {
      ...row,
      milestone: 'ayer',
      fechaObjetivo,
      status: reason ? 'omitido' : 'disponible',
      reason: reason || null,
      mensaje,
      whatsappUrl: buildWhatsappSendUrl(row.Tel_Cli, mensaje),
      adminText: buildAdminTelegramText(row, 'ayer')
    };
  });

  return { today, fechaObjetivo, items };
}

async function procesarRecordatorio(row, milestone, fechaObjetivo, options = {}) {
  const pool = options.pool || getPool();
  const forceResend = Boolean(options.forceResend);
  const dryRun = options.dryRun ?? env.telegramDryRun;
  const existingLog = await telegramRepository.findLog(pool, row.Id_Sus, milestone, fechaObjetivo);

  if (existingLog?.Est_Envio === 'enviado' && !forceResend) {
    return {
      status: 'skipped',
      reason: 'El recordatorio ya fue procesado anteriormente.',
      logStatus: existingLog.Est_Envio,
      whatsappUrl: ''
    };
  }

  const reason = ruleSkipReason(row);
  if (reason) {
    if (!dryRun) {
      await telegramRepository.upsertLog(pool, {
        Id_Sus: row.Id_Sus,
        Tip_Rec: milestone,
        Fec_Objetivo: fechaObjetivo,
        Chat_Id: env.telegramAdminChatId,
        Est_Envio: 'omitido',
        Err_Envio: reason
      });
    }
    return { status: 'skipped', reason, logStatus: 'omitido', whatsappUrl: '' };
  }

  const context = options.context || await loadMessageContext();
  const plantilla = plantillaDeFila(context, row);
  if (!plantilla) {
    const templateError = 'No existe una plantilla activa de vencimiento para WhatsApp.';
    if (!dryRun) {
      await telegramRepository.upsertLog(pool, {
        Id_Sus: row.Id_Sus,
        Tip_Rec: milestone,
        Fec_Objetivo: fechaObjetivo,
        Chat_Id: env.telegramAdminChatId,
        Est_Envio: 'error',
        Err_Envio: templateError
      });
    }
    return { status: 'error', reason: templateError, whatsappUrl: '' };
  }

  const mensaje = buildReminderMensaje(plantilla, variablesDeFila(row, milestone, context.config));
  const whatsappUrl = buildWhatsappSendUrl(row.Tel_Cli, mensaje);
  const adminText = buildAdminTelegramText(row, milestone);
  const replyMarkup = { inline_keyboard: [[{ text: 'Enviar recordatorio', url: whatsappUrl }]] };

  if (dryRun) {
    return {
      status: 'preview',
      reason: 'Dry run: no enviado.',
      mensaje,
      adminText,
      whatsappUrl,
      replyMarkup
    };
  }

  const { data, error } = await sendMessage({
    chatId: env.telegramAdminChatId,
    text: adminText,
    replyMarkup
  });

  if (error) {
    const message = error.message || 'No se pudo enviar el mensaje por Telegram.';
    await telegramRepository.upsertLog(pool, {
      Id_Sus: row.Id_Sus,
      Tip_Rec: milestone,
      Fec_Objetivo: fechaObjetivo,
      Chat_Id: env.telegramAdminChatId,
      Est_Envio: 'error',
      Err_Envio: message
    });
    return { status: 'error', reason: message, mensaje, adminText, whatsappUrl };
  }

  await telegramRepository.upsertLog(pool, {
    Id_Sus: row.Id_Sus,
    Tip_Rec: milestone,
    Fec_Objetivo: fechaObjetivo,
    Chat_Id: env.telegramAdminChatId,
    Est_Envio: 'enviado',
    Err_Envio: null
  });

  return {
    status: 'sent',
    mensaje,
    adminText,
    whatsappUrl,
    telegramMessageId: data?.message_id || null
  };
}

module.exports = {
  MILESTONES,
  normalizeMilestone,
  listarPorVencer,
  listarVencidasAyer,
  procesarRecordatorio
};
