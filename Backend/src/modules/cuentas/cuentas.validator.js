const { estados, allowedFields } = require('./cuentas.schemas');
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
  if (value === null || value === '') return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid date`);
    return value;
  }

  return toEcuadorDateTime(date).slice(0, 10);
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate && !isNumericId(clean.Id_Prd) && !isNumericId(clean.Id_Var)) {
    errors.push('Id_Prd or Id_Var is required and at least one must be a positive integer');
  }

  if (clean.Id_Prd !== undefined) {
    if (clean.Id_Prd === null || clean.Id_Prd === '') {
      clean.Id_Prd = null;
    } else {
      const productId = Number(clean.Id_Prd);
      if (!Number.isInteger(productId) || productId <= 0) {
        errors.push('Id_Prd must be a positive integer or null');
      } else {
        clean.Id_Prd = productId;
      }
    }
  }

  if (clean.Id_Var !== undefined) {
    if (clean.Id_Var === null || clean.Id_Var === '') {
      clean.Id_Var = null;
    } else {
      const variantId = Number(clean.Id_Var);
      if (!Number.isInteger(variantId) || variantId <= 0) {
        errors.push('Id_Var must be a positive integer or null');
      } else {
        clean.Id_Var = variantId;
      }
    }
  }

  if (clean.Id_Pro !== undefined) {
    if (clean.Id_Pro === null || clean.Id_Pro === '') {
      clean.Id_Pro = null;
    } else {
      const providerId = Number(clean.Id_Pro);
      if (!Number.isInteger(providerId) || providerId <= 0) {
        errors.push('Id_Pro must be a positive integer or null');
      } else {
        clean.Id_Pro = providerId;
      }
    }
  }

  clean.Nom_Cue = normalizeOptionalString(clean.Nom_Cue);
  clean.Usu_Cue = normalizeOptionalString(clean.Usu_Cue);
  clean.Pas_Cue = normalizeOptionalString(clean.Pas_Cue);
  clean.Pin_Cue = normalizeOptionalString(clean.Pin_Cue);
  clean.Per_Cue = normalizeOptionalString(clean.Per_Cue);
  clean.Not_Cue = normalizeOptionalString(clean.Not_Cue);

  if (clean.Tot_Per_Cue !== undefined) {
    const total = Number(clean.Tot_Per_Cue);
    if (!Number.isInteger(total) || total < 1) {
      errors.push('Tot_Per_Cue must be an integer greater or equal to 1');
    } else {
      clean.Tot_Per_Cue = total;
    }
  }

  if (clean.Per_Dis_Cue !== undefined) {
    const available = Number(clean.Per_Dis_Cue);
    if (!Number.isInteger(available) || available < 0) {
      errors.push('Per_Dis_Cue must be an integer greater or equal to 0');
    } else {
      clean.Per_Dis_Cue = available;
    }
  }

  clean.Fec_Com_Cue = normalizeDate(clean.Fec_Com_Cue, 'Fec_Com_Cue', errors);
  clean.Fec_Ven_Cue = normalizeDate(clean.Fec_Ven_Cue, 'Fec_Ven_Cue', errors);

  if (clean.Cos_Cue !== undefined) {
    if (clean.Cos_Cue === null || clean.Cos_Cue === '') {
      clean.Cos_Cue = null;
    } else {
      const cost = Number(clean.Cos_Cue);
      if (Number.isNaN(cost) || cost < 0) {
        errors.push('Cos_Cue must be a number greater or equal to 0');
      } else {
        clean.Cos_Cue = cost;
      }
    }
  }

  if (clean.Est_Cue !== undefined && !estados.includes(clean.Est_Cue)) {
    errors.push('Est_Cue must be disponible, ocupada, parcial, vencida or suspendida');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
