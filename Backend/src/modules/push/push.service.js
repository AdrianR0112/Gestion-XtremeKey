const pushRepository = require('./push.repository');
const { validateSuscripcionPushPayload } = require('./push.validator');
const webPushService = require('../../services/webPush.service');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

function getClavePublica() {
  if (!webPushService.isPushConfigured()) {
    throw createHttpError(503, 'Las notificaciones push no están configuradas.');
  }
  return { publicKey: webPushService.getVapidPublicKey() };
}

async function registrarSuscripcion(body, context) {
  const validation = validateSuscripcionPushPayload(body);
  if (!validation.isValid) throw createHttpError(400, 'Suscripción push inválida.', validation.errors);
  return pushRepository.upsertSuscripcion({
    ...validation.payload,
    Auth_Usu_Id: context.authUserId,
    Id_Stf: context.staffId || null,
    Age_Usu_Psh: context.userAgent || null
  });
}

async function eliminarSuscripcion(body, authUserId) {
  const endpoint = String(body?.endpoint || '').trim();
  const id = String(body?.id || '').trim();
  const row = endpoint
    ? await pushRepository.findByEndpointHash(pushRepository.hashEndpoint(endpoint))
    : id ? await pushRepository.findById(id) : null;
  if (!row || row.Auth_Usu_Id !== authUserId) throw createHttpError(404, 'Dispositivo no encontrado.');
  await pushRepository.removeById(row.Id_Psh);
  return { removed: true };
}

async function listarSuscripciones(authUserId) {
  const rows = await pushRepository.findActivasByAuthUser(authUserId);
  return rows.map((row) => ({
    id: row.Id_Psh,
    label: row.Eti_Psh,
    userAgent: row.Age_Usu_Psh,
    createdAt: row.Fec_Cre,
    lastSentAt: row.Fec_Ult_Env_Psh,
    endpointHash: row.End_Has_Psh
  }));
}

async function notificarUsuarios(payload, { suscripciones } = {}) {
  const devices = suscripciones || await pushRepository.findTodasActivas();
  const summary = { processedCount: devices.length, sentCount: 0, prunedCount: 0, errorCount: 0, items: [] };

  for (const device of devices) {
    const result = await webPushService.sendPush(pushRepository.toWebPushSubscription(device), payload);
    if (result.gone) {
      await pushRepository.removeById(device.Id_Psh);
      summary.prunedCount += 1;
      summary.items.push({ id: device.Id_Psh, status: 'pruned', error: result.error?.message || null });
    } else if (result.error) {
      summary.errorCount += 1;
      summary.items.push({ id: device.Id_Psh, status: 'error', error: result.error.message || 'No se pudo enviar.' });
    } else {
      await pushRepository.touchUltimoEnvio(device.Id_Psh);
      summary.sentCount += 1;
      summary.items.push({ id: device.Id_Psh, status: 'sent', error: null });
    }
  }
  return summary;
}

async function enviarPrueba(authUserId) {
  const suscripciones = await pushRepository.findActivasByAuthUser(authUserId);
  if (suscripciones.length === 0) throw createHttpError(404, 'No hay dispositivos activos para este usuario.');
  const summary = await notificarUsuarios({
    title: 'Notificaciones activadas',
    body: 'Este dispositivo ya puede recibir recordatorios de vencimiento.',
    tag: `push-prueba-${Date.now()}`,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    data: { url: '/recordatorios' }
  }, { suscripciones });
  if (summary.sentCount === 0 && summary.errorCount > 0) {
    throw createHttpError(502, summary.items[0]?.error || 'No se pudo entregar la notificación de prueba.');
  }
  return summary;
}

module.exports = {
  getClavePublica,
  registrarSuscripcion,
  eliminarSuscripcion,
  listarSuscripciones,
  enviarPrueba,
  notificarUsuarios
};
