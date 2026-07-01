const { estados, allowedFields } = require('./detalleVentas.schemas');
const { toEcuadorDateTime } = require('../../utils/dateHelper');
const { z, validationResult, isNumericId, optionalTrimmedNullableString } = require('../../utils/zod');

function pickAllowed(payload = {}) {
  const clean = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
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

function getDetalleVentasPayloadSchema(isUpdate) {
  return z.object({
    Id_Ven: isUpdate ? z.any().optional() : z.any().refine((value) => isNumericId(value), { message: 'Id_Ven is required and must be a positive integer' }),
    Id_Prd: z.any().optional(),
    Id_Var: z.any().optional(),
    Id_Cue: z.any().optional(),
    Id_Key: z.any().optional(),
    Can_Dve: z.any().optional(),
    Pre_Uni_Dve: isUpdate ? z.any().optional() : z.any().refine((value) => value !== undefined && value !== null && value !== '', { message: 'Pre_Uni_Dve is required' }),
    Des_Uni_Dve: z.any().optional(),
    Fec_Ini_Dve: z.any().optional(),
    Fec_Fin_Dve: z.any().optional(),
    Cor_Cue: optionalTrimmedNullableString,
    Con_Cue: optionalTrimmedNullableString,
    Not_Dve: optionalTrimmedNullableString,
    Est_Dve: z.enum(estados).optional().refine((value) => value === undefined || estados.includes(value), {
      message: 'Est_Dve must be activo, vencido, cancelado or renovado',
    }),
  }).passthrough().transform((payload) => {
    const clean = pickAllowed(payload);
    const errors = [];

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

    if (clean.Fec_Ini_Dve && clean.Fec_Fin_Dve) {
      const start = new Date(clean.Fec_Ini_Dve);
      const end = new Date(clean.Fec_Fin_Dve);
      if (end < start) {
        errors.push('Fec_Fin_Dve cannot be earlier than Fec_Ini_Dve');
      }
    }

    if (clean.Pre_Uni_Dve !== undefined) {
      const descuento = clean.Des_Uni_Dve ?? 0;
      if (descuento > clean.Pre_Uni_Dve) {
        errors.push('Des_Uni_Dve cannot be greater than Pre_Uni_Dve');
      }
    }

    clean._computedSubtotal = computeSubtotal(clean);

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getDetalleVentasPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId, computeSubtotal };
