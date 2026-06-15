const { categoriasGasto, estadosGasto, allowedFields } = require('./gastos.schemas');
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

function normalizeDate(value, fieldName, errors) {
  if (value === undefined) return undefined;
  if (value === null || value === '') {
    errors.push(`${fieldName} is required`);
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid date`);
    return value;
  }

  return toEcuadorDateTime(date).slice(0, 10);
}

function normalizeBlob(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return String(value).trim() || null;
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!clean.Nom_Gas || String(clean.Nom_Gas).trim() === '') {
      errors.push('Nom_Gas is required');
    }

    if (clean.Mon_Gas === undefined || clean.Mon_Gas === null || clean.Mon_Gas === '') {
      errors.push('Mon_Gas is required');
    }

    if (clean.Fec_Gas === undefined || clean.Fec_Gas === null || clean.Fec_Gas === '') {
      errors.push('Fec_Gas is required');
    }
  }

  if (clean.Nom_Gas !== undefined) {
    clean.Nom_Gas = String(clean.Nom_Gas).trim();
    if (clean.Nom_Gas === '') {
      errors.push('Nom_Gas cannot be empty');
    } else if (clean.Nom_Gas.length > 150) {
      errors.push('Nom_Gas cannot exceed 150 characters');
    }
  }

  clean.Des_Gas = normalizeOptionalString(clean.Des_Gas);

  if (clean.Cat_Gas !== undefined && !categoriasGasto.includes(clean.Cat_Gas)) {
    errors.push('Cat_Gas must be operativo, administrativo, marketing, proveedor, impuesto or otro');
  }

  if (clean.Mon_Gas !== undefined) {
    const amount = Number(clean.Mon_Gas);
    if (Number.isNaN(amount) || amount < 0) {
      errors.push('Mon_Gas must be a number greater or equal to 0');
    } else {
      clean.Mon_Gas = amount;
    }
  }

  clean.Fec_Gas = normalizeDate(clean.Fec_Gas, 'Fec_Gas', errors);

  const optionalIds = ['Id_Pro', 'Id_Com'];
  for (const field of optionalIds) {
    if (clean[field] !== undefined) {
      if (clean[field] === null || clean[field] === '') {
        clean[field] = null;
      } else {
        const idValue = Number(clean[field]);
        if (!Number.isInteger(idValue) || idValue <= 0) {
          errors.push(`${field} must be a positive integer or null`);
        } else {
          clean[field] = idValue;
        }
      }
    }
  }

  try {
    const blob = normalizeBlob(clean.Com_Gas);
    if (blob !== undefined) {
      clean.Com_Gas = blob;
    }
  } catch (error) {
    errors.push(error.message);
  }

  if (clean.Est_Gas !== undefined && !estadosGasto.includes(clean.Est_Gas)) {
    errors.push('Est_Gas must be registrado, pagado or cancelado');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
