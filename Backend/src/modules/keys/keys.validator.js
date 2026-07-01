const { estados, allowedFields } = require('./keys.schemas');
const { toEcuadorDateTime } = require('../../utils/dateHelper');
const { z, validationResult, isNumericId, optionalTinyIntBoolean, optionalTrimmedNullableString } = require('../../utils/zod');

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

function getKeysPayloadSchema(isUpdate) {
  return z.object({
    Id_Prd: z.any().optional(),
    Id_Var: z.any().optional(),
    Id_Pro: z.any().optional(),
    Cla_Key: z.any().optional(),
    Des_Key: optionalTrimmedNullableString,
    Not_Key: optionalTrimmedNullableString,
    Fec_Com_Key: z.any().optional(),
    Fec_Ven_Key: z.any().optional(),
    Cos_Key: z.any().optional(),
    Pre_Ven_Key: z.any().optional(),
    Es_Per_Vid_Key: optionalTinyIntBoolean,
    Est_Key: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Prd) && !isNumericId(payload.Id_Var)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd or Id_Var is required and at least one must be a positive integer' });
      }

      if (!payload.Cla_Key || String(payload.Cla_Key).trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['Cla_Key'], message: 'Cla_Key is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    for (const field of ['Id_Prd', 'Id_Var', 'Id_Pro']) {
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

    if (clean.Cla_Key !== undefined) {
      clean.Cla_Key = String(clean.Cla_Key).trim();
      if (clean.Cla_Key === '') {
        errors.push('Cla_Key cannot be empty');
      }
    }

    clean.Fec_Com_Key = normalizeDate(clean.Fec_Com_Key, 'Fec_Com_Key', errors);
    clean.Fec_Ven_Key = normalizeDate(clean.Fec_Ven_Key, 'Fec_Ven_Key', errors);

    for (const field of ['Cos_Key', 'Pre_Ven_Key']) {
      if (clean[field] !== undefined) {
        if (clean[field] === null || clean[field] === '') {
          clean[field] = null;
        } else {
          const value = Number(clean[field]);
          if (Number.isNaN(value) || value < 0) {
            errors.push(`${field} must be a number greater or equal to 0`);
          } else {
            clean[field] = value;
          }
        }
      }
    }

    if (clean.Est_Key !== undefined && !estados.includes(clean.Est_Key)) {
      errors.push('Est_Key must be disponible, vendida, reservada, vencida or cancelada');
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getKeysPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
