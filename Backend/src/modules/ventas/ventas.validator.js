const { estados, allowedFields } = require('./ventas.schemas');
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
    const hasCli = isNumericId(clean.Id_Cli);
    const hasRev = isNumericId(clean.Id_Rev);

    if (!hasCli && !hasRev) {
      errors.push('Debe especificar Id_Cli o Id_Rev (al menos uno requerido).');
    }

    if (hasCli && hasRev) {
      errors.push('No puede especificar Id_Cli e Id_Rev al mismo tiempo.');
    }

    if (clean.Tot_Ven === undefined || clean.Tot_Ven === null || clean.Tot_Ven === '') {
      errors.push('Tot_Ven is required');
    }
  }

  if (clean.Id_Cli !== undefined) {
    if (clean.Id_Cli === null || clean.Id_Cli === '') {
      clean.Id_Cli = null;
    } else {
      const clientId = Number(clean.Id_Cli);
      if (!Number.isInteger(clientId) || clientId <= 0) {
        errors.push('Id_Cli must be a positive integer or null');
      } else {
        clean.Id_Cli = clientId;
      }
    }
  }

  if (clean.Id_Rev !== undefined) {
    if (clean.Id_Rev === null || clean.Id_Rev === '') {
      clean.Id_Rev = null;
    } else {
      const revId = Number(clean.Id_Rev);
      if (!Number.isInteger(revId) || revId <= 0) {
        errors.push('Id_Rev must be a positive integer or null');
      } else {
        clean.Id_Rev = revId;
      }
    }
  }

  clean.Fec_Ven = normalizeDateTime(clean.Fec_Ven, 'Fec_Ven', errors);

  const numericFields = ['Des_Tot_Ven', 'Imp_Tot_Ven', 'Tot_Ven'];
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

  clean.Met_Pag_Ven = normalizeOptionalString(clean.Met_Pag_Ven);
  clean.Not_Ven = normalizeOptionalString(clean.Not_Ven);

  if (clean.Est_Ven !== undefined && !estados.includes(clean.Est_Ven)) {
    errors.push('Est_Ven must be pendiente, completada, cancelada or reembolsada');
  }

  if (clean.Est_Ven === 'completada' && !clean.Met_Pag_Ven) {
    errors.push('Met_Pag_Ven is required when Est_Ven is completada');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
