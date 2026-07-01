const { z, validationResult, isNumericId } = require('../../utils/zod');
const { pickAllowed, normalizePositiveInteger } = require('../../utils/entityHelpers');
const { allowedFields } = require('./listaDeseos.schemas');

function getPayloadSchema(isUpdate) {
  return z.object({ Id_Cli: z.any().optional(), Id_Prd: z.any().optional() }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Cli)) ctx.addIssue({ code: 'custom', path: ['Id_Cli'], message: 'Id_Cli is required and must be a positive integer' });
      if (!isNumericId(payload.Id_Prd)) ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd is required and must be a positive integer' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, allowedFields);
    clean.Id_Cli = normalizePositiveInteger(clean.Id_Cli, 'Id_Cli', errors);
    clean.Id_Prd = normalizePositiveInteger(clean.Id_Prd, 'Id_Prd', errors);
    if (errors.length > 0) throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) { return validationResult(getPayloadSchema(isUpdate), payload); }

module.exports = { validatePayload, isNumericId };
