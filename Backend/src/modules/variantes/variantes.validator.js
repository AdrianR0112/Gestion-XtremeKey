const { estados, allowedFields } = require('./variantes.schemas');

const durationTypes = ['dias', 'meses', 'anios'];

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

function normalizeAtrVar(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    return JSON.parse(value);
  }
  throw new Error('Atr_Var must be a JSON object, JSON string, null, or empty.');
}

function normalizeBoolean(value, fieldName) {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'si', 'sí', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  }

  throw new Error(`${fieldName} must be a boolean value.`);
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!isNumericId(clean.Id_Prd)) {
      errors.push('Id_Prd is required and must be a positive integer');
    }

    if (!clean.Nom_Var || String(clean.Nom_Var).trim() === '') {
      errors.push('Nom_Var is required');
    }

    if (clean.Pre_Cos_Var === undefined || clean.Pre_Cos_Var === null || clean.Pre_Cos_Var === '') {
      errors.push('Pre_Cos_Var is required');
    }

    if (clean.Pre_Ven_Var === undefined || clean.Pre_Ven_Var === null || clean.Pre_Ven_Var === '') {
      errors.push('Pre_Ven_Var is required');
    }
  }

  if (clean.Id_Prd !== undefined && clean.Id_Prd !== null && clean.Id_Prd !== '') {
    const productId = Number(clean.Id_Prd);
    if (!Number.isInteger(productId) || productId <= 0) {
      errors.push('Id_Prd must be a positive integer');
    } else {
      clean.Id_Prd = productId;
    }
  }

  if (clean.Nom_Var !== undefined) {
    clean.Nom_Var = String(clean.Nom_Var).trim();
    if (clean.Nom_Var === '') {
      errors.push('Nom_Var cannot be empty');
    }
  }

  clean.Des_Var = normalizeOptionalString(clean.Des_Var);

  if (clean.Pre_Cos_Var !== undefined) {
    if (clean.Pre_Cos_Var === null || clean.Pre_Cos_Var === '') {
      errors.push('Pre_Cos_Var is required');
    } else {
      const price = Number(clean.Pre_Cos_Var);
      if (Number.isNaN(price) || price < 0) {
        errors.push('Pre_Cos_Var must be a number greater or equal to 0');
      } else {
        clean.Pre_Cos_Var = price;
      }
    }
  }

  if (clean.Pre_Ven_Var !== undefined) {
    if (clean.Pre_Ven_Var === null || clean.Pre_Ven_Var === '') {
      errors.push('Pre_Ven_Var is required');
    } else {
      const price = Number(clean.Pre_Ven_Var);
      if (Number.isNaN(price) || price < 0) {
        errors.push('Pre_Ven_Var must be a number greater or equal to 0');
      } else {
        clean.Pre_Ven_Var = price;
      }
    }
  }

  if (clean.Pre_Rev_Var !== undefined) {
    if (clean.Pre_Rev_Var === null || clean.Pre_Rev_Var === '') {
      clean.Pre_Rev_Var = null;
    } else {
      const price = Number(clean.Pre_Rev_Var);
      if (Number.isNaN(price) || price < 0) {
        errors.push('Pre_Rev_Var must be a number greater or equal to 0');
      } else {
        clean.Pre_Rev_Var = price;
      }
    }
  }

  if (clean.Dur_Tip_Var !== undefined && !durationTypes.includes(clean.Dur_Tip_Var)) {
    errors.push('Dur_Tip_Var must be dias, meses or anios');
  }

  if (clean.Dur_Val_Var !== undefined) {
    if (clean.Dur_Val_Var === null || clean.Dur_Val_Var === '') {
      clean.Dur_Val_Var = null;
    } else {
      const durationValue = Number(clean.Dur_Val_Var);
      if (!Number.isInteger(durationValue) || durationValue < 1) {
        errors.push('Dur_Val_Var must be an integer greater or equal to 1');
      } else {
        clean.Dur_Val_Var = durationValue;
      }
    }
  }

  if (clean.Max_Usu_Var !== undefined) {
    if (clean.Max_Usu_Var === null || clean.Max_Usu_Var === '') {
      clean.Max_Usu_Var = null;
    } else {
      const maxUsers = Number(clean.Max_Usu_Var);
      if (!Number.isInteger(maxUsers) || maxUsers < 1) {
        errors.push('Max_Usu_Var must be an integer greater or equal to 1');
      } else {
        clean.Max_Usu_Var = maxUsers;
      }
    }
  }

  try {
    const notifyEmail = normalizeBoolean(clean.Not_Ven_Cor_Var, 'Not_Ven_Cor_Var');
    if (notifyEmail !== undefined) {
      clean.Not_Ven_Cor_Var = notifyEmail;
    }
  } catch (error) {
    errors.push(error.message);
  }

  try {
    const notifyWhatsapp = normalizeBoolean(clean.Not_Ven_Wsp_Var, 'Not_Ven_Wsp_Var');
    if (notifyWhatsapp !== undefined) {
      clean.Not_Ven_Wsp_Var = notifyWhatsapp;
    }
  } catch (error) {
    errors.push(error.message);
  }

  if (clean.Est_Var !== undefined && !estados.includes(clean.Est_Var)) {
    errors.push('Est_Var must be activo or inactivo');
  }

  try {
    const attrs = normalizeAtrVar(clean.Atr_Var);
    if (attrs !== undefined) {
      clean.Atr_Var = attrs;
    }
  } catch (error) {
    errors.push(error.message);
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
