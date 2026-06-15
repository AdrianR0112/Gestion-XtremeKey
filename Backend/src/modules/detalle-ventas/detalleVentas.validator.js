const { estados, allowedFields } = require('./detalleVentas.schemas');
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

function computeSubtotal(payload) {
  const can = Number(payload.Can_Dve ?? 1);
  const pre = Number(payload.Pre_Uni_Dve ?? 0);
  const des = Number(payload.Des_Uni_Dve ?? 0);
  return Number((can * (pre - des)).toFixed(2));
}

function getTodayDateTimeValue() {
  return toEcuadorDateTime(new Date());
}

function normalizeDateTime(value, fieldName, errors) {
  if (value === undefined) return undefined;
  if (value === null || value === '') {
    errors.push(`${fieldName} is required`);
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid datetime`);
    return value;
  }

  return toEcuadorDateTime(date);
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

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!isNumericId(clean.Id_Ven)) {
      errors.push('Id_Ven is required and must be a positive integer');
    }

    if (clean.Pre_Uni_Dve === undefined || clean.Pre_Uni_Dve === null || clean.Pre_Uni_Dve === '') {
      errors.push('Pre_Uni_Dve is required');
    }
  }

  if (clean.Id_Ven !== undefined) {
    const idVenta = Number(clean.Id_Ven);
    if (!Number.isInteger(idVenta) || idVenta <= 0) {
      errors.push('Id_Ven must be a positive integer');
    } else {
      clean.Id_Ven = idVenta;
    }
  }

  if (clean.Id_Prd !== undefined) {
    if (clean.Id_Prd === null || clean.Id_Prd === '') {
      clean.Id_Prd = null;
    } else {
      const idProducto = Number(clean.Id_Prd);
      if (!Number.isInteger(idProducto) || idProducto <= 0) {
        errors.push('Id_Prd must be a positive integer or null');
      } else {
        clean.Id_Prd = idProducto;
      }
    }
  }

  const optionalIds = ['Id_Var', 'Id_Cue', 'Id_Key'];
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

  if (clean.Can_Dve !== undefined) {
    const cantidad = Number(clean.Can_Dve);
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      errors.push('Can_Dve must be an integer greater or equal to 1');
    } else {
      clean.Can_Dve = cantidad;
    }
  }

  const numericFields = ['Pre_Uni_Dve', 'Des_Uni_Dve'];
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

  if (clean.Fec_Ini_Dve === undefined || clean.Fec_Ini_Dve === null || clean.Fec_Ini_Dve === '') {
    clean.Fec_Ini_Dve = getTodayDateTimeValue();
  }

  if (clean.Fec_Fin_Dve === undefined || clean.Fec_Fin_Dve === null || clean.Fec_Fin_Dve === '') {
    clean.Fec_Fin_Dve = clean.Fec_Ini_Dve;
  }

  clean.Fec_Ini_Dve = normalizeDateTime(clean.Fec_Ini_Dve, 'Fec_Ini_Dve', errors);
  clean.Fec_Fin_Dve = normalizeDateTime(clean.Fec_Fin_Dve, 'Fec_Fin_Dve', errors);

  clean.Cor_Cue = normalizeOptionalString(clean.Cor_Cue);
  clean.Con_Cue = normalizeOptionalString(clean.Con_Cue);
  clean.Not_Dve = normalizeOptionalString(clean.Not_Dve);

  if (clean.Est_Dve !== undefined && !estados.includes(clean.Est_Dve)) {
    errors.push('Est_Dve must be activo, vencido, cancelado or renovado');
  }

  if (clean.Fec_Ini_Dve && clean.Fec_Fin_Dve) {
    const start = new Date(clean.Fec_Ini_Dve);
    const end = new Date(clean.Fec_Fin_Dve);
    if (end < start) {
      errors.push('Fec_Fin_Dve cannot be earlier than Fec_Ini_Dve');
    }
  }

  if (clean.Pre_Uni_Dve !== undefined) {
    const cantidad = clean.Can_Dve ?? 1;
    const descuento = clean.Des_Uni_Dve ?? 0;
    if (descuento > clean.Pre_Uni_Dve) {
      errors.push('Des_Uni_Dve cannot be greater than Pre_Uni_Dve');
    }
  }

  clean._computedSubtotal = computeSubtotal(clean);

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId, computeSubtotal };
