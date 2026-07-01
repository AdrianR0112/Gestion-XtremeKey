const { estados, allowedFields } = require('./variantes.schemas');
const { z, validationResult, isNumericId, optionalTrimmedNullableString } = require('../../utils/zod');

const durationTypes = ['dias', 'meses', 'anios'];

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

function getVariantesPayloadSchema(isUpdate) {
  return z.object({
    Id_Prd: z.any().optional(),
    Nom_Var: z.any().optional(),
    Des_Var: optionalTrimmedNullableString,
    Pre_Cos_Var: z.any().optional(),
    Pre_Ven_Var: z.any().optional(),
    Pre_Rev_Var: z.any().optional(),
    Dur_Tip_Var: z.any().optional(),
    Dur_Val_Var: z.any().optional(),
    Max_Usu_Var: z.any().optional(),
    Not_Ven_Cor_Var: z.any().optional(),
    Not_Ven_Wsp_Var: z.any().optional(),
    Est_Var: z.any().optional(),
    Atr_Var: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Prd)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd is required and must be a positive integer' });
      }

      if (!payload.Nom_Var || String(payload.Nom_Var).trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['Nom_Var'], message: 'Nom_Var is required' });
      }

      if (payload.Pre_Cos_Var === undefined || payload.Pre_Cos_Var === null || payload.Pre_Cos_Var === '') {
        ctx.addIssue({ code: 'custom', path: ['Pre_Cos_Var'], message: 'Pre_Cos_Var is required' });
      }

      if (payload.Pre_Ven_Var === undefined || payload.Pre_Ven_Var === null || payload.Pre_Ven_Var === '') {
        ctx.addIssue({ code: 'custom', path: ['Pre_Ven_Var'], message: 'Pre_Ven_Var is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

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

    for (const field of ['Pre_Cos_Var', 'Pre_Ven_Var']) {
      if (clean[field] !== undefined) {
        if (clean[field] === null || clean[field] === '') {
          errors.push(`${field} is required`);
        } else {
          const price = Number(clean[field]);
          if (Number.isNaN(price) || price < 0) {
            errors.push(`${field} must be a number greater or equal to 0`);
          } else {
            clean[field] = price;
          }
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

    for (const field of ['Dur_Val_Var', 'Max_Usu_Var']) {
      if (clean[field] !== undefined) {
        if (clean[field] === null || clean[field] === '') {
          clean[field] = null;
        } else {
          const value = Number(clean[field]);
          if (!Number.isInteger(value) || value < 1) {
            errors.push(`${field} must be an integer greater or equal to 1`);
          } else {
            clean[field] = value;
          }
        }
      }
    }

    for (const [field, message] of [['Not_Ven_Cor_Var', 'Not_Ven_Cor_Var'], ['Not_Ven_Wsp_Var', 'Not_Ven_Wsp_Var']]) {
      try {
        const normalized = normalizeBoolean(clean[field], message);
        if (normalized !== undefined) {
          clean[field] = normalized;
        }
      } catch (error) {
        errors.push(error.message);
      }
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

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getVariantesPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
