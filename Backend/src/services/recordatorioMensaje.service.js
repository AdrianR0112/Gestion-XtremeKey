const { normalizeWhatsappPhone, toDateOnly } = require('./vencimientoEmail.service');
const { renderPlantilla } = require('../utils/plantillas');
const { getTimezone } = require('../utils/dateHelper');

/**
 * Construccion del texto de los recordatorios de suscripcion.
 *
 * Es la unica fuente del mensaje que ve el cliente: lo usan el job de Telegram
 * (que se lo manda al admin con un boton wa.me) y el boton manual del modulo de
 * suscripciones. Si se duplica en cualquiera de los dos, los textos vuelven a
 * divergir.
 */

function buildWhatsappSendUrl(telCli, mensaje) {
  const phone = normalizeWhatsappPhone(telCli);
  if (!phone) return '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(String(mensaje || ''))}`;
}

function formatDuration(value, type) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return '';

  const units = {
    dias: amount === 1 ? 'Día' : 'Días',
    meses: amount === 1 ? 'Mes' : 'Meses',
    anios: amount === 1 ? 'Año' : 'Años'
  };
  return `${amount} ${units[type] || type || 'unidades'}`;
}

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Etiqueta interna para la ficha del admin en Telegram: incluye el precio
 * porque ahi si es informacion util. El cliente ve buildServicioCliente.
 */
function buildServicioLabel({ Nom_Prd, Nom_Var, Dur_Val_Var, Dur_Tip_Var, Pre_Ven_Var } = {}) {
  const product = String(Nom_Prd || 'Suscripción').trim();
  const variantOrDuration = String(Nom_Var || '').trim() || formatDuration(Dur_Val_Var, Dur_Tip_Var);
  const price = formatPrice(Pre_Ven_Var);
  const parts = [product, variantOrDuration].filter(Boolean).join(' - ');
  return price ? `${parts} / ${price} dólares` : parts;
}

/**
 * Lo que ve el cliente: "Adobe Creative 2026 · Premium". Sin precio, porque va
 * incrustado a mitad de frase ("Tu suscripción de X venció hoy") y el importe
 * ahi solo estorba; quien lo quiera tiene {{precio}} aparte.
 */
function buildServicioCliente({ Nom_Prd, Nom_Var, Dur_Val_Var, Dur_Tip_Var } = {}) {
  const producto = String(Nom_Prd || 'Suscripción').trim();
  const plan = String(Nom_Var || '').trim() || formatDuration(Dur_Val_Var, Dur_Tip_Var);
  return [producto, plan].filter(Boolean).join(' · ');
}

/**
 * "Premium (1 mes)" — nombre del plan mas su duracion.
 *
 * Cuando el plan ya se llama por su duracion (hay variantes llamadas "1 Mes")
 * se devuelve solo el nombre: "1 Mes (1 mes)" queda ridiculo en el mensaje.
 */
function buildPlanLabel({ Nom_Var, Dur_Val_Var, Dur_Tip_Var } = {}) {
  const nombre = String(Nom_Var || '').trim();
  const duracion = formatDuration(Dur_Val_Var, Dur_Tip_Var).toLowerCase();
  if (!nombre) return duracion || '';
  if (!duracion) return nombre;
  if (nombre.toLowerCase().includes(duracion)) return nombre;
  return `${nombre} (${duracion})`;
}

/** El revendedor paga su propia tarifa. */
function buildPrecioLabel(row = {}) {
  const esRevendedor = row.Tip_Tit_Sus === 'revendedor' || Boolean(row.Id_Rev);
  const bruto = esRevendedor ? row.Pre_Rev_Var ?? row.Pre_Ven_Var : row.Pre_Ven_Var;
  const monto = Number(bruto);
  if (!Number.isFinite(monto)) return '';
  return `$${monto.toFixed(2)}`;
}

/**
 * Fecha en palabras: "6 de agosto de 2026".
 *
 * Una cadena "YYYY-MM-DD" sin hora la parsea el estandar como medianoche UTC y
 * en Ecuador retrocederia al dia anterior, asi que se ancla al mediodia antes
 * de formatear (mismo cuidado que parseFecha en el frontend).
 */
function formatFechaLarga(fecha) {
  if (!fecha) return '';

  const base = fecha instanceof Date
    ? fecha
    : /^\d{4}-\d{2}-\d{2}$/.test(String(fecha).trim())
      ? new Date(`${String(fecha).trim()}T12:00:00`)
      : new Date(fecha);

  if (Number.isNaN(base.getTime())) return '';

  return new Intl.DateTimeFormat('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: getTimezone()
  }).format(base);
}

/**
 * Estado en palabras, para ir dentro de una frase.
 *
 * dias > 0 aun no vence, 0 vence hoy, < 0 ya vencio. Es el espejo de
 * formatVenceEn del frontend (modules/suscripciones/utils/vencimiento.js): si
 * se toca uno hay que tocar el otro.
 *
 * El dia exacto del vencimiento se habla en pasado ("venció hoy") a proposito:
 * el mensaje busca que el cliente renueve ya.
 */
function estadoCorto(dias) {
  if (dias === null || dias === undefined || Number.isNaN(Number(dias))) return 'está por vencer';

  const valor = Number(dias);
  if (valor > 1) return `vence en ${valor} días`;
  if (valor === 1) return 'vence mañana';
  if (valor === 0) return 'venció hoy';
  if (valor === -1) return 'venció ayer';
  return `venció hace ${Math.abs(valor)} días`;
}

/** "venció hoy (6 de agosto de 2026)" — lo que consume {{estado}}. */
function estadoDetallado(dias, fechaFin) {
  const corto = estadoCorto(dias);
  const fecha = formatFechaLarga(fechaFin);
  return fecha ? `${corto} (${fecha})` : corto;
}

const DIAS_POR_HITO = { pre_5: 5, pre_1: 1, dia: 0, ayer: -1 };

/** Traduce el hito del cron a dias, para que ambos caminos usen la misma regla. */
function diasDesdeMilestone(milestone) {
  if (milestone === 5 || milestone === '5') return 5;
  if (milestone === 1 || milestone === '1') return 1;
  if (milestone === 0 || milestone === '0' || milestone === 'hoy') return 0;
  return DIAS_POR_HITO[milestone] ?? 0;
}

/** Forma corta, sin fecha: la ficha del admin ya lleva el vencimiento aparte. */
function estadoTexto(milestone) {
  return estadoCorto(diasDesdeMilestone(milestone));
}

/**
 * Variables disponibles en la plantilla de vencimiento.
 * Vive aqui (y no en telegram.service) porque el boton manual las necesita
 * igual y no debe depender del modulo de Telegram.
 */
function buildReminderVariables(row, dias, config) {
  return {
    cliente: [row.Nom_Cli, row.Ape_Cli].filter(Boolean).join(' ') || 'Cliente',
    servicio: buildServicioCliente(row),
    estado: estadoDetallado(dias, row.Fec_Fin_Sus),
    estado_corto: estadoCorto(dias),
    fecha: formatFechaLarga(row.Fec_Fin_Sus),
    producto: String(row.Nom_Prd || '').trim(),
    plan: buildPlanLabel(row),
    precio: buildPrecioLabel(row),
    // Correo del cliente final. En una suscripcion de revendedor es lo unico
    // que le dice cual de sus cuentas vence.
    cuenta: String(row.Cor_Cue_Sus || row.Cor_Cue || '').trim(),
    empresa: config?.Nom_Emp_Con || ''
  };
}

/**
 * Plantilla de vencimiento segun el tipo de titular.
 *
 * Un revendedor tiene su propia redaccion porque el aviso va a su telefono pero
 * la cuenta es de su cliente. Si no hay plantilla propia se cae a la general
 * para no dejarlo sin mensaje.
 */
async function resolverPlantillaVencimiento(esRevendedor) {
  const plantillasRepository = require('../modules/plantillas-notificacion/plantillasNotificacion.repository');

  if (esRevendedor) {
    const propia = await plantillasRepository.findActivaByTipoCanal('vencimiento_revendedor', 'whatsapp');
    if (propia) return propia;
  }

  return plantillasRepository.findActivaByTipoCanal('vencimiento', 'whatsapp');
}

function buildReminderMensaje(plantilla, variables = {}) {
  return renderPlantilla(plantilla?.Cue_Pla, variables);
}

function buildAdminTelegramText(row, milestone) {
  const cliente = [row.Nom_Cli, row.Ape_Cli].filter(Boolean).join(' ') || 'Cliente';
  const servicio = buildServicioLabel(row);
  const fecha = toDateOnly(row.Fec_Fin_Sus) || row.Fec_Fin_Sus || 'sin fecha';
  return [
    '*Recordatorio de suscripción*',
    `Cliente: ${cliente}`,
    `Servicio: ${servicio}`,
    `Estado: ${estadoTexto(milestone)}`,
    `Vencimiento: ${fecha}`,
    `Teléfono: ${row.Tel_Cli || 'sin teléfono'}`
  ].join('\n');
}

module.exports = {
  buildWhatsappSendUrl,
  buildServicioLabel,
  buildServicioCliente,
  buildPlanLabel,
  buildPrecioLabel,
  formatFechaLarga,
  estadoCorto,
  estadoDetallado,
  estadoTexto,
  diasDesdeMilestone,
  buildReminderVariables,
  buildReminderMensaje,
  buildAdminTelegramText,
  resolverPlantillaVencimiento
};
