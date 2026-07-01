const { estados, allowedFields } = require('./cuentas.schemas');
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

function getCuentasPayloadSchema(isUpdate) {
  return z.object({
    Id_Prd: z.any().optional(),
    Id_Var: z.any().optional(),
    Id_Pro: z.any().optional(),
    Nom_Cue: optionalTrimmedNullableString,
    Usu_Cue: optionalTrimmedNullableString,
    Pas_Cue: optionalTrimmedNullableString,
    Pin_Cue: optionalTrimmedNullableString,
    Per_Cue: optionalTrimmedNullableString,
    Not_Cue: optionalTrimmedNullableString,
    Tot_Per_Cue: z.any().optional(),
    Per_Dis_Cue: z.any().optional(),
    Fec_Com_Cue: z.any().optional(),
    Fec_Ven_Cue: z.any().optional(),
    Cos_Cue: z.any().optional(),
    Est_Cue: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate && !isNumericId(payload.Id_Prd) && !isNumericId(payload.Id_Var)) {
      ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd or Id_Var is required and at least one must be a positive integer' });
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

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getCuentasPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
