const { estados, allowedFields } = require('./revendedores.schemas');

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

  if (!isUpdate) {
    if (!clean.Tel_Rev || String(clean.Tel_Rev).trim() === '') {
      errors.push('Tel_Rev is required');
    }
  }

  if (clean.Tel_Rev !== undefined) {
    clean.Tel_Rev = normalizeOptionalString(clean.Tel_Rev);
    if (clean.Tel_Rev === null) {
      errors.push('Tel_Rev cannot be empty');
    }
  }

  clean.Nom_Rev = normalizeOptionalString(clean.Nom_Rev);
  clean.Ape_Rev = normalizeOptionalString(clean.Ape_Rev);
  clean.Ema_Rev = normalizeOptionalString(clean.Ema_Rev);
  clean.Doc_Rev = normalizeOptionalString(clean.Doc_Rev);
  clean.Not_Rev = normalizeOptionalString(clean.Not_Rev);

  if (clean.Ema_Rev && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.Ema_Rev)) {
    errors.push('Ema_Rev must be a valid email');
  }

  if (clean.Est_Rev !== undefined && !estados.includes(clean.Est_Rev)) {
    errors.push('Est_Rev must be activo or inactivo');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
