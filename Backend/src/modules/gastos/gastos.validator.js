const { categoriasGasto, estadosGasto, allowedFields } = require('./gastos.schemas');
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

function normalizeBlob(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return String(value).trim() || null;
}

function getGastosPayloadSchema(isUpdate) {
  return z.object({
    Nom_Gas: z.any().optional(),
    Des_Gas: optionalTrimmedNullableString,
    Cat_Gas: z.any().optional(),
    Mon_Gas: z.any().optional(),
    Fec_Gas: z.any().optional(),
    Id_Pro: z.any().optional(),
    Id_Com: z.any().optional(),
    Com_Gas: z.any().optional(),
    Est_Gas: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!payload.Nom_Gas || String(payload.Nom_Gas).trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['Nom_Gas'], message: 'Nom_Gas is required' });
      }

      if (payload.Mon_Gas === undefined || payload.Mon_Gas === null || payload.Mon_Gas === '') {
        ctx.addIssue({ code: 'custom', path: ['Mon_Gas'], message: 'Mon_Gas is required' });
      }

      if (payload.Fec_Gas === undefined || payload.Fec_Gas === null || payload.Fec_Gas === '') {
        ctx.addIssue({ code: 'custom', path: ['Fec_Gas'], message: 'Fec_Gas is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Nom_Gas !== undefined) {
      clean.Nom_Gas = String(clean.Nom_Gas).trim();
      if (clean.Nom_Gas === '') {
        errors.push('Nom_Gas cannot be empty');
      } else if (clean.Nom_Gas.length > 150) {
        errors.push('Nom_Gas cannot exceed 150 characters');
      }
    }

    if (clean.Cat_Gas !== undefined && !categoriasGasto.includes(clean.Cat_Gas)) {
      errors.push('Cat_Gas must be operativo, administrativo, marketing, proveedor, impuesto or otro');
    }

    if (clean.Mon_Gas !== undefined) {
      const amount = Number(clean.Mon_Gas);
      if (Number.isNaN(amount) || amount < 0) {
        errors.push('Mon_Gas must be a number greater or equal to 0');
      } else {
        clean.Mon_Gas = amount;
      }
    }

    clean.Fec_Gas = normalizeDate(clean.Fec_Gas, 'Fec_Gas', errors);

    for (const field of ['Id_Pro', 'Id_Com']) {
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

    clean.Com_Gas = normalizeBlob(clean.Com_Gas);

    if (clean.Est_Gas !== undefined && !estadosGasto.includes(clean.Est_Gas)) {
      errors.push('Est_Gas must be registrado, pagado or cancelado');
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getGastosPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
