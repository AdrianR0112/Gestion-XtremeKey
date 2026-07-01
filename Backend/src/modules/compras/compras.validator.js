const { estados, allowedFields } = require('./compras.schemas');
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

function getComprasPayloadSchema(isUpdate) {
  return z.object({
    Id_Pro: z.any().optional(),
    Fec_Com: z.any().optional(),
    Sub_Tot_Com: z.any().optional(),
    Imp_Tot_Com: z.any().optional(),
    Tot_Com: z.any().optional(),
    Met_Pag_Com: optionalTrimmedNullableString,
    Not_Com: optionalTrimmedNullableString,
    Est_Com: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Pro)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Pro'], message: 'Id_Pro is required and must be a positive integer' });
      }

      if (payload.Sub_Tot_Com === undefined || payload.Sub_Tot_Com === null || payload.Sub_Tot_Com === '') {
        ctx.addIssue({ code: 'custom', path: ['Sub_Tot_Com'], message: 'Sub_Tot_Com is required' });
      }

      if (payload.Tot_Com === undefined || payload.Tot_Com === null || payload.Tot_Com === '') {
        ctx.addIssue({ code: 'custom', path: ['Tot_Com'], message: 'Tot_Com is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Id_Pro !== undefined) {
      const providerId = Number(clean.Id_Pro);
      if (!Number.isInteger(providerId) || providerId <= 0) {
        errors.push('Id_Pro must be a positive integer');
      } else {
        clean.Id_Pro = providerId;
      }
    }

    clean.Fec_Com = normalizeDateTime(clean.Fec_Com, 'Fec_Com', errors);

    for (const field of ['Sub_Tot_Com', 'Imp_Tot_Com', 'Tot_Com']) {
      if (clean[field] !== undefined) {
        const value = Number(clean[field]);
        if (Number.isNaN(value) || value < 0) {
          errors.push(`${field} must be a number greater or equal to 0`);
        } else {
          clean[field] = value;
        }
      }
    }

    if (clean.Est_Com !== undefined && !estados.includes(clean.Est_Com)) {
      errors.push('Est_Com must be pendiente, completada or cancelada');
    }

    if (clean.Sub_Tot_Com !== undefined && clean.Tot_Com !== undefined) {
      const imp = clean.Imp_Tot_Com ?? 0;
      const expected = Number((clean.Sub_Tot_Com + imp).toFixed(2));
      const received = Number(clean.Tot_Com.toFixed(2));
      if (Math.abs(expected - received) > 0.01) {
        errors.push('Tot_Com must match Sub_Tot_Com + Imp_Tot_Com');
      }
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getComprasPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
