const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    const error = new Error('Token requerido.');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (_error) {
    const error = new Error('Token invalido o expirado.');
    error.statusCode = 401;
    return next(error);
  }
}

module.exports = { authMiddleware };
