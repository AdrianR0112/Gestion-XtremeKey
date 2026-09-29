const crypto = require('node:crypto');
const { env } = require('../config/env');

function cronTokenMiddleware(req, _res, next) {
  const expected = Buffer.from(String(env.cronToken || ''), 'utf8');
  const received = Buffer.from(String(req.get('X-Cron-Token') || ''), 'utf8');
  const valid = expected.length > 0 && received.length === expected.length && crypto.timingSafeEqual(received, expected);
  if (!valid) {
    const error = new Error('Token de cron inválido.');
    error.statusCode = 401;
    return next(error);
  }
  return next();
}

module.exports = { cronTokenMiddleware };
