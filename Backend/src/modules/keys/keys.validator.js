const { estados, allowedFields } = require('./keys.schemas');
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

  if (!isUpdate) {
    if (!isNumericId(clean.Id_Prd) && !isNumericId(clean.Id_Var)) {
      errors.push('Id_Prd or Id_Var is required and at least one must be a positive integer');
    }

    if (!clean.Cla_Key || String(clean.Cla_Key).trim() === '') {
      errors.push('Cla_Key is required');
    }
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

  if (clean.Cla_Key !== undefined) {
    clean.Cla_Key = String(clean.Cla_Key).trim();
    if (clean.Cla_Key === '') {
      errors.push('Cla_Key cannot be empty');
    }
  }

  clean.Des_Key = normalizeOptionalString(clean.Des_Key);
  clean.Not_Key = normalizeOptionalString(clean.Not_Key);
  clean.Fec_Com_Key = normalizeDate(clean.Fec_Com_Key, 'Fec_Com_Key', errors);
  clean.Fec_Ven_Key = normalizeDate(clean.Fec_Ven_Key, 'Fec_Ven_Key', errors);

  if (clean.Cos_Key !== undefined) {
    if (clean.Cos_Key === null || clean.Cos_Key === '') {
      clean.Cos_Key = null;
    } else {
      const cost = Number(clean.Cos_Key);
      if (Number.isNaN(cost) || cost < 0) {
        errors.push('Cos_Key must be a number greater or equal to 0');
      } else {
        clean.Cos_Key = cost;
      }
    }
  }

  if (clean.Pre_Ven_Key !== undefined) {
    if (clean.Pre_Ven_Key === null || clean.Pre_Ven_Key === '') {
      clean.Pre_Ven_Key = null;
    } else {
      const sale = Number(clean.Pre_Ven_Key);
      if (Number.isNaN(sale) || sale < 0) {
        errors.push('Pre_Ven_Key must be a number greater or equal to 0');
      } else {
        clean.Pre_Ven_Key = sale;
      }
    }
  }

  if (clean.Es_Per_Vid_Key !== undefined) {
    clean.Es_Per_Vid_Key = normalizeTinyInt(clean.Es_Per_Vid_Key);
  }

  if (clean.Est_Key !== undefined && !estados.includes(clean.Est_Key)) {
    errors.push('Est_Key must be disponible, vendida, reservada, vencida or cancelada');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
