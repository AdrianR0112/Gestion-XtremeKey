const { roles, estados, createAllowedFields, updateAllowedFields } = require('./usuarios.schemas');

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function isNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

function pickAllowed(payload = {}, allowed = []) {
  const clean = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
}

function validateCreatePayload(payload = {}) {
  const errors = [];
  const clean = pickAllowed(payload, createAllowedFields);

  if (!clean.Nom_Usu || String(clean.Nom_Usu).trim() === '') {
    errors.push('Nom_Usu is required');
  }

  if (!clean.Ape_Usu || String(clean.Ape_Usu).trim() === '') {
    errors.push('Ape_Usu is required');
  }

  if (!clean.Ema_Usu || !isEmail(clean.Ema_Usu)) {
    errors.push('Ema_Usu must be a valid email');
  } else {
    clean.Ema_Usu = String(clean.Ema_Usu).trim().toLowerCase();
  }

  if (!clean.Pas_Usu || String(clean.Pas_Usu).length < 6) {
    errors.push('Pas_Usu must have at least 6 characters');
  }

  if (clean.Rol_Usu !== undefined && !roles.includes(clean.Rol_Usu)) {
    errors.push('Rol_Usu must be admin or vendedor');
  }

  if (clean.Est_Usu !== undefined && !estados.includes(clean.Est_Usu)) {
    errors.push('Est_Usu must be activo, inactivo or bloqueado');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

function validateUpdatePayload(payload = {}) {
  const errors = [];
  const clean = pickAllowed(payload, updateAllowedFields);

  if (clean.Ema_Usu !== undefined) {
    if (!isEmail(clean.Ema_Usu)) {
      errors.push('Ema_Usu must be a valid email');
    } else {
      clean.Ema_Usu = String(clean.Ema_Usu).trim().toLowerCase();
    }
  }

  if (clean.Pas_Usu !== undefined && String(clean.Pas_Usu).length < 6) {
    errors.push('Pas_Usu must have at least 6 characters');
  }

  if (clean.Rol_Usu !== undefined && !roles.includes(clean.Rol_Usu)) {
    errors.push('Rol_Usu must be admin or vendedor');
  }

  if (clean.Est_Usu !== undefined && !estados.includes(clean.Est_Usu)) {
    errors.push('Est_Usu must be activo, inactivo or bloqueado');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

function validateEstadoPayload(payload = {}) {
  const estado = payload.Est_Usu;
  if (!estado || !estados.includes(estado)) {
    return {
      isValid: false,
      errors: ['Est_Usu must be activo, inactivo or bloqueado'],
      payload: {}
    };
  }

  return { isValid: true, errors: [], payload: { Est_Usu: estado } };
}

module.exports = {
  isNumericId,
  validateCreatePayload,
  validateUpdatePayload,
  validateEstadoPayload
};
