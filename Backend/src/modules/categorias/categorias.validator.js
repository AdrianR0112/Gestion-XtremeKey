const { estados, allowedFields } = require('./categorias.schemas');
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

function getCategoriaPayloadSchema(isUpdate) {
  return z.object({
    Nom_Cat: isUpdate ? z.any().optional() : z.string().trim().min(1, 'Nom_Cat is required'),
    Des_Cat: optionalTrimmedNullableString,
    Ico_Cat: optionalTrimmedNullableString,
    Id_Cat_Pad: z.preprocess((value) => {
      if (value === undefined) return undefined;
      if (value === null || value === '') return null;
      return Number(value);
    }, z.number().int().positive('Id_Cat_Pad must be a positive integer or null').nullable().optional()),
    Ord_Cat: z.preprocess((value) => {
      if (value === undefined) return undefined;
      return Number(value);
    }, z.number().int().min(0, 'Ord_Cat must be an integer greater or equal to 0').optional()),
    Est_Cat: z.enum(estados).optional().refine((value) => value === undefined || estados.includes(value), {
      message: 'Est_Cat must be activo or inactivo',
    }),
  }).passthrough().transform((payload) => {
    const clean = pickAllowed(payload);
    if (clean.Nom_Cat !== undefined) {
      clean.Nom_Cat = String(clean.Nom_Cat).trim();
    }
    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const result = validationResult(getCategoriaPayloadSchema(isUpdate), payload);
  if (result.isValid && result.payload.Nom_Cat !== undefined && result.payload.Nom_Cat === '') {
    return { isValid: false, errors: ['Nom_Cat cannot be empty'], payload: {} };
  }
  return result;
}

module.exports = { validatePayload, isNumericId };
