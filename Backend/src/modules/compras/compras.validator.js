const { estados, allowedFields } = require('./compras.schemas');
const { toEcuadorDateTime } = require('../../utils/dateHelper');

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

function normalizeDateTime(value, fieldName, errors) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid datetime`);
    return value;
  }

  return toEcuadorDateTime(date);
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!isNumericId(clean.Id_Pro)) {
      errors.push('Id_Pro is required and must be a positive integer');
    }

    if (clean.Sub_Tot_Com === undefined || clean.Sub_Tot_Com === null || clean.Sub_Tot_Com === '') {
      errors.push('Sub_Tot_Com is required');
    }

    if (clean.Tot_Com === undefined || clean.Tot_Com === null || clean.Tot_Com === '') {
      errors.push('Tot_Com is required');
    }
  }

  if (clean.Id_Pro !== undefined) {
    const providerId = Number(clean.Id_Pro);
    if (!Number.isInteger(providerId) || providerId <= 0) {
      errors.push('Id_Pro must be a positive integer');
    } else {
      clean.Id_Pro = providerId;
    }
  }

  clean.Fec_Com = normalizeDateTime(clean.Fec_Com, 'Fec_Com', errors);

  const numericFields = ['Sub_Tot_Com', 'Imp_Tot_Com', 'Tot_Com'];
  for (const field of numericFields) {
    if (clean[field] !== undefined) {
      const value = Number(clean[field]);
      if (Number.isNaN(value) || value < 0) {
        errors.push(`${field} must be a number greater or equal to 0`);
      } else {
        clean[field] = value;
      }
    }
  }

  clean.Met_Pag_Com = normalizeOptionalString(clean.Met_Pag_Com);
  clean.Not_Com = normalizeOptionalString(clean.Not_Com);

  if (clean.Est_Com !== undefined && !estados.includes(clean.Est_Com)) {
    errors.push('Est_Com must be pendiente, completada or cancelada');
  }

  if (clean.Sub_Tot_Com !== undefined && clean.Tot_Com !== undefined) {
    const imp = clean.Imp_Tot_Com ?? 0;
    const expected = Number((clean.Sub_Tot_Com + imp).toFixed(2));
    const received = Number(clean.Tot_Com.toFixed(2));
    if (Math.abs(expected - received) > 0.01) {
      errors.push('Tot_Com must match Sub_Tot_Com + Imp_Tot_Com');
    }
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
