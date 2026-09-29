const { getPool } = require('../../config/database');
const plantillasRepository = require('../plantillas-notificacion/plantillasNotificacion.repository');
const configuracionRepository = require('../configuracion/configuracion.repository');
const recordatoriosRepository = require('./recordatorios.repository');
const {
  buildReminderMensaje,
  buildReminderVariables,
  buildWhatsappSendUrl,
  diasDesdeMilestone
} = require('../../services/recordatorioMensaje.service');
const { toDateOnly, normalizeWhatsappPhone } = require('../../services/vencimientoEmail.service');

const MILESTONES = ['pre_5', 'pre_1', 'dia'];
const ALL_MILESTONES = [...MILESTONES, 'ayer'];

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeMilestone(value) {
  if (value === 5 || value === '5' || value === 'pre_5') return 'pre_5';
  if (value === 1 || value === '1' || value === 'pre_1') return 'pre_1';
  if (value === 0 || value === '0' || value === 'dia' || value === 'hoy') return 'dia';
  if (value === -1 || value === '-1' || value === 'ayer') return 'ayer';
  return value;
}

function getDateWithOffset(today, offset) {
  const [year, month, day] = today.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function getDateForMilestone(today, milestone) {
  return getDateWithOffset(today, milestone === 'pre_5' ? 5 : milestone === 'pre_1' ? 1 : 0);
}

async function loadMessageContext() {
  const [config, template, templateRevendedor] = await Promise.all([
    configuracionRepository.findCurrent(),
    plantillasRepository.findActivaByTipoCanal('vencimiento', 'whatsapp'),
    plantillasRepository.findActivaByTipoCanal('vencimiento_revendedor', 'whatsapp')
  ]);
  return { config, template, templateRevendedor };
}

function plantillaDeFila(context, row) {
  const esRevendedor = row.Tip_Tit_Sus === 'revendedor' || Boolean(row.Id_Rev);
  if (esRevendedor && context.templateRevendedor) return context.templateRevendedor;
  return context.template;
}

function variablesDeFila(row, milestone, config) {
  return buildReminderVariables(row, diasDesdeMilestone(milestone), config);
}

function ruleSkipReason(row) {
  if (!row.Not_Ven_Wsp_Var) return 'La variante tiene desactivados los recordatorios por WhatsApp.';
  if (!row.Ace_Not_What_Cli) return 'El cliente no acepta notificaciones por WhatsApp.';
  if (!normalizeWhatsappPhone(row.Tel_Cli)) return 'El cliente no tiene un teléfono registrado.';
  return '';
}

function mapRecordatorio(row, milestone, fechaObjetivo, context) {
  const reason = ruleSkipReason(row);
  const plantilla = plantillaDeFila(context, row);
  const mensaje = plantilla ? buildReminderMensaje(plantilla, variablesDeFila(row, milestone, context.config)) : '';
  return {
    ...row,
    milestone,
    fechaObjetivo,
    status: reason ? 'omitido' : 'disponible',
    reason: reason || null,
    mensaje,
    whatsappUrl: buildWhatsappSendUrl(row.Tel_Cli, mensaje),
    yaEnviado: row.Est_Env_Rec === 'enviado'
  };
}

async function listarPorVencer(milestones = [5, 1, 0]) {
  const today = toDateOnly(new Date());
  const normalized = [...new Set((Array.isArray(milestones) ? milestones : [milestones]).map(normalizeMilestone))]
    .filter((value) => MILESTONES.includes(value));
  const context = await loadMessageContext();
  const items = [];
  for (const milestone of normalized) {
    const fechaObjetivo = getDateForMilestone(today, milestone);
    const rows = await recordatoriosRepository.findSuscripcionesPorVencer(getPool(), fechaObjetivo, milestone);
    items.push(...rows.map((row) => mapRecordatorio(row, milestone, fechaObjetivo, context)));
  }
  return { today, milestones: normalized, items };
}

async function listarVencidasAyer() {
  const today = toDateOnly(new Date());
  const fechaObjetivo = getDateWithOffset(today, -1);
  const context = await loadMessageContext();
  const rows = await recordatoriosRepository.findSuscripcionesVencidasAyer(getPool(), fechaObjetivo);
  return { today, fechaObjetivo, items: rows.map((row) => mapRecordatorio(row, 'ayer', fechaObjetivo, context)) };
}

function validateLogInput(idSus, values) {
  const id = Number(idSus);
  const milestone = normalizeMilestone(values.milestone);
  const fechaObjetivo = String(values.fechaObjetivo || '').trim();
  const canal = values.canal || 'whatsapp';
  if (!Number.isInteger(id) || id <= 0) throw createHttpError(400, 'Id_Sus inválido.');
  if (!ALL_MILESTONES.includes(milestone)) throw createHttpError(400, 'Hito de recordatorio inválido.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaObjetivo)) throw createHttpError(400, 'Fecha objetivo inválida.');
  if (canal !== 'whatsapp') throw createHttpError(400, 'Canal de recordatorio inválido.');
  return { id, milestone, fechaObjetivo, canal };
}

async function marcarRecordatorioEnviado(idSus, values) {
  const clean = validateLogInput(idSus, values);
  return recordatoriosRepository.upsertLog({
    Id_Sus: clean.id,
    Can_Rec: clean.canal,
    Tip_Rec: clean.milestone,
    Fec_Objetivo: clean.fechaObjetivo,
    Des_Rec: values.destino || null,
    Est_Envio: 'enviado',
    Err_Envio: null,
    Aut_Usu_Id: values.authUserId || null
  });
}

async function desmarcarRecordatorioEnviado(idSus, values) {
  const clean = validateLogInput(idSus, values);
  const removed = await recordatoriosRepository.deleteLog(
    clean.id, clean.canal, clean.milestone, clean.fechaObjetivo
  );
  if (!removed) throw createHttpError(404, 'Recordatorio enviado no encontrado.');
  return { removed: true };
}

module.exports = {
  MILESTONES,
  normalizeMilestone,
  getDateForMilestone,
  getDateWithOffset,
  loadMessageContext,
  plantillaDeFila,
  variablesDeFila,
  ruleSkipReason,
  listarPorVencer,
  listarVencidasAyer,
  marcarRecordatorioEnviado,
  desmarcarRecordatorioEnviado
};
