const { estados, allowedFields } = require('./categorias.schemas');

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

  if (!isUpdate && (!clean.Nom_Cat || String(clean.Nom_Cat).trim() === '')) {
    errors.push('Nom_Cat is required');
  }

  if (clean.Nom_Cat !== undefined) {
    clean.Nom_Cat = String(clean.Nom_Cat).trim();
    if (clean.Nom_Cat === '') {
      errors.push('Nom_Cat cannot be empty');
    }
  }

  clean.Des_Cat = normalizeOptionalString(clean.Des_Cat);
  clean.Ico_Cat = normalizeOptionalString(clean.Ico_Cat);

  if (clean.Id_Cat_Pad !== undefined) {
    if (clean.Id_Cat_Pad === null || clean.Id_Cat_Pad === '') {
      clean.Id_Cat_Pad = null;
    } else {
      const parentId = Number(clean.Id_Cat_Pad);
      if (!Number.isInteger(parentId) || parentId <= 0) {
        errors.push('Id_Cat_Pad must be a positive integer or null');
      } else {
        clean.Id_Cat_Pad = parentId;
      }
    }
  }

  if (clean.Ord_Cat !== undefined) {
    const order = Number(clean.Ord_Cat);
    if (!Number.isInteger(order) || order < 0) {
      errors.push('Ord_Cat must be an integer greater or equal to 0');
    } else {
      clean.Ord_Cat = order;
    }
  }

  if (clean.Est_Cat !== undefined && !estados.includes(clean.Est_Cat)) {
    errors.push('Est_Cat must be activo or inactivo');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
