const webpush = require('web-push');

const { env } = require('../config/env');
const { logger } = require('../config/logger');

let vapidReady = false;

function isPushConfigured() {
  return Boolean(env.pushEnabled && env.pushVapidPublicKey && env.pushVapidPrivateKey);
}

function ensureVapid() {
  if (vapidReady) return true;
  if (!isPushConfigured()) return false;
  webpush.setVapidDetails(env.pushVapidSubject, env.pushVapidPublicKey, env.pushVapidPrivateKey);
  vapidReady = true;
  return true;
}

async function sendPush(subscription, payload, options = {}) {
  try {
    if (!ensureVapid()) {
      return { data: null, error: new Error('Web Push no está configurado o está deshabilitado.'), gone: false };
    }
    const data = await webpush.sendNotification(
      subscription,
      typeof payload === 'string' ? payload : JSON.stringify(payload),
      options
    );
    return { data, error: null, gone: false };
  } catch (error) {
    const gone = error?.statusCode === 404 || error?.statusCode === 410;
    if (!gone) logger.error('Error enviando notificación Web Push.', error);
    return { data: null, error, gone };
  }
}

function getVapidPublicKey() {
  return env.pushVapidPublicKey || '';
}

module.exports = { isPushConfigured, ensureVapid, sendPush, getVapidPublicKey };
