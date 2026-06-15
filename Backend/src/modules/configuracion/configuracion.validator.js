const { allowedFields, requiredCreateFields } = require('./configuracion.schemas');

function isEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

function normalizeLogValue(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return String(value).trim() || null;
}

function normalizeBooleanFlag(value, fieldName) {
  if (value === undefined) return { value: undefined, error: null };
  if (typeof value === 'boolean') return { value, error: null };
  if (value === 1 || value === '1') return { value: true, error: null };
  if (value === 0 || value === '0') return { value: false, error: null };
  return { value, error: `${fieldName} must be a boolean value` };
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = {};

  if (!isUpdate) {
    for (const field of requiredCreateFields) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        errors.push(`${field} is required`);
      }
    }
  }

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }

  if (clean.Nom_Emp_Con !== undefined && String(clean.Nom_Emp_Con).trim() === '') {
    errors.push('Nom_Emp_Con cannot be empty');
  }

  if (clean.Ema_Con !== undefined && !isEmail(clean.Ema_Con)) {
    errors.push('Ema_Con must be a valid email');
  }

  if (clean.Imp_Con !== undefined) {
    const imp = Number(clean.Imp_Con);
    if (Number.isNaN(imp) || imp < 0 || imp > 100) {
      errors.push('Imp_Con must be a number between 0 and 100');
    } else {
      clean.Imp_Con = imp;
    }
  }

  if (clean.Hab_Imp_Con !== undefined) {
    const normalized = normalizeBooleanFlag(clean.Hab_Imp_Con, 'Hab_Imp_Con');
    if (normalized.error) {
      errors.push(normalized.error);
    } else {
      clean.Hab_Imp_Con = normalized.value;
    }
  }

  try {
    const normalizedLog = normalizeLogValue(clean.Log_Con);
    if (normalizedLog !== undefined) {
      clean.Log_Con = normalizedLog;
    }
  } catch (error) {
    errors.push(error.message);
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
