const { roles, createAllowedFields } = require('./auth.schemas');

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function validateRegisterPayload(payload = {}) {
  const errors = [];
  const clean = {};

  for (const key of createAllowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }

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

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

function validateLoginPayload(payload = {}) {
  const errors = [];
  const clean = {
    Ema_Usu: String(payload.Ema_Usu || '').trim().toLowerCase(),
    Pas_Usu: String(payload.Pas_Usu || '')
  };

  if (!isEmail(clean.Ema_Usu)) {
    errors.push('Ema_Usu must be a valid email');
  }

  if (!clean.Pas_Usu) {
    errors.push('Pas_Usu is required');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

function validateChangePasswordPayload(payload = {}) {
  const errors = [];
  const clean = {
    currentPassword: String(payload.currentPassword || ''),
    newPassword: String(payload.newPassword || '')
  };

  if (!clean.currentPassword) {
    errors.push('currentPassword is required');
  }

  if (!clean.newPassword || clean.newPassword.length < 6) {
    errors.push('newPassword must have at least 6 characters');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
  validateChangePasswordPayload
};
