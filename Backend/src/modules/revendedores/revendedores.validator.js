const { estados, allowedFields } = require('./revendedores.schemas');
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

function getRevendedoresPayloadSchema(isUpdate) {
  return z.object({
    Tel_Rev: optionalTrimmedNullableString,
    Nom_Rev: optionalTrimmedNullableString,
    Ape_Rev: optionalTrimmedNullableString,
    Ema_Rev: optionalTrimmedNullableString,
    Doc_Rev: optionalTrimmedNullableString,
    Not_Rev: optionalTrimmedNullableString,
    Est_Rev: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate && (!payload.Tel_Rev || String(payload.Tel_Rev).trim() === '')) {
      ctx.addIssue({ code: 'custom', path: ['Tel_Rev'], message: 'Tel_Rev is required' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Tel_Rev !== undefined && clean.Tel_Rev === null) {
      errors.push('Tel_Rev cannot be empty');
    }

    if (clean.Ema_Rev && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.Ema_Rev)) {
      errors.push('Ema_Rev must be a valid email');
    }

    if (clean.Est_Rev !== undefined && !estados.includes(clean.Est_Rev)) {
      errors.push('Est_Rev must be activo or inactivo');
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getRevendedoresPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
