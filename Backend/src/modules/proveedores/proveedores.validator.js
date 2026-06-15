const {
  tiposProveedor,
  mediosContacto,
  estados,
  allowedFields
} = require('./proveedores.schemas');

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function isNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

function pickAllowed(payload = {}) {
  const clean = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
}

function normalizeOptionalString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate && (!clean.Nom_Pro || String(clean.Nom_Pro).trim() === '')) {
    errors.push('Nom_Pro is required');
  }

  if (clean.Ema_Pro !== undefined) {
    const email = normalizeOptionalString(clean.Ema_Pro);
    if (email !== null && !isEmail(email)) {
      errors.push('Ema_Pro must be a valid email');
    }
    clean.Ema_Pro = email;
  }

  clean.Con_Pri_Pro = normalizeOptionalString(clean.Con_Pri_Pro);
  clean.Tel_Pro = normalizeOptionalString(clean.Tel_Pro);
  clean.Wha_Pro = normalizeOptionalString(clean.Wha_Pro);
  clean.Tel_Gram_Pro = normalizeOptionalString(clean.Tel_Gram_Pro);
  clean.Web_Pro = normalizeOptionalString(clean.Web_Pro);
  clean.Pai_Pro = normalizeOptionalString(clean.Pai_Pro);
  clean.Con_Com_Pro = normalizeOptionalString(clean.Con_Com_Pro);
  clean.Not_Pro = normalizeOptionalString(clean.Not_Pro);

  if (clean.Tip_Pro !== undefined && !tiposProveedor.includes(clean.Tip_Pro)) {
    errors.push('Tip_Pro must be persona, empresa, plataforma, tienda_web or otro');
  }

  if (clean.Med_Con_Pro !== undefined && !mediosContacto.includes(clean.Med_Con_Pro)) {
    errors.push('Med_Con_Pro must be whatsapp, telegram, web, email or telefono');
  }

  if (clean.Est_Pro !== undefined && !estados.includes(clean.Est_Pro)) {
    errors.push('Est_Pro must be activo, inactivo or suspendido');
  }

  if (clean.Cal_Pro !== undefined) {
    const rating = Number(clean.Cal_Pro);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      errors.push('Cal_Pro must be an integer between 1 and 5');
    } else {
      clean.Cal_Pro = rating;
    }
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
