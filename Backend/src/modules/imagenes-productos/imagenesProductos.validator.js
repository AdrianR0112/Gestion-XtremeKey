const { z, validationResult, isNumericId, optionalTrimmedNullableString, optionalTinyIntBoolean } = require('../../utils/zod');
const { pickAllowed, normalizePositiveInteger } = require('../../utils/entityHelpers');
const { allowedFields } = require('./imagenesProductos.schemas');

function getPayloadSchema(isUpdate) {
  return z.object({ Id_Prd: z.any().optional(), Url_Ima: z.any().optional(), Texto_Alt: optionalTrimmedNullableString, Orden: z.any().optional(), Es_Primaria: optionalTinyIntBoolean }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Prd)) ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd is required and must be a positive integer' });
      if (!payload.Url_Ima || String(payload.Url_Ima).trim() === '') ctx.addIssue({ code: 'custom', path: ['Url_Ima'], message: 'Url_Ima is required' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, allowedFields);
    clean.Id_Prd = normalizePositiveInteger(clean.Id_Prd, 'Id_Prd', errors);
    clean.Orden = normalizePositiveInteger(clean.Orden, 'Orden', errors, { min: 0 });
    if (clean.Url_Ima !== undefined) { clean.Url_Ima = String(clean.Url_Ima).trim(); if (clean.Url_Ima === '') errors.push('Url_Ima cannot be empty'); }
    if (errors.length > 0) throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) { return validationResult(getPayloadSchema(isUpdate), payload); }

module.exports = { validatePayload, isNumericId };
