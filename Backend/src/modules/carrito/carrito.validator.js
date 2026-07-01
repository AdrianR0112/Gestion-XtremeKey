const { z, validationResult, isNumericId, optionalTrimmedNullableString } = require('../../utils/zod');
const {
  pickAllowed,
  normalizeDateTime,
  normalizePositiveInteger,
} = require('../../utils/entityHelpers');
const { sessionAllowedFields, itemAllowedFields } = require('./carrito.schemas');

function validateSessionId(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 64;
}

function getSessionPayloadSchema(isUpdate) {
  return z.object({
    Id_Car_Ses: z.any().optional(),
    Id_Cli: z.any().optional(),
    Id_Sesion_Tmp: optionalTrimmedNullableString,
    Expira_En: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate && !validateSessionId(payload.Id_Car_Ses)) {
      ctx.addIssue({ code: 'custom', path: ['Id_Car_Ses'], message: 'Id_Car_Ses is required and must be a string up to 64 chars' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, sessionAllowedFields);

    if (clean.Id_Car_Ses !== undefined) {
      clean.Id_Car_Ses = String(clean.Id_Car_Ses).trim();
      if (!validateSessionId(clean.Id_Car_Ses)) {
        errors.push('Id_Car_Ses must be a string up to 64 chars');
      }
    }

    clean.Id_Cli = normalizePositiveInteger(clean.Id_Cli, 'Id_Cli', errors, { allowNull: true });
    clean.Expira_En = normalizeDateTime(clean.Expira_En, 'Expira_En', errors);

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function getItemPayloadSchema(isUpdate) {
  return z.object({
    Id_Prd: z.any().optional(),
    Id_Var: z.any().optional(),
    Cantidad: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate && !isNumericId(payload.Id_Prd)) {
      ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd is required and must be a positive integer' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, itemAllowedFields);

    clean.Id_Prd = normalizePositiveInteger(clean.Id_Prd, 'Id_Prd', errors);
    clean.Id_Var = normalizePositiveInteger(clean.Id_Var, 'Id_Var', errors, { allowNull: true });
    clean.Cantidad = normalizePositiveInteger(clean.Cantidad, 'Cantidad', errors, { allowNull: false, min: 1 });

    if (clean.Cantidad === undefined) {
      clean.Cantidad = 1;
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validateSessionPayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getSessionPayloadSchema(isUpdate), payload);
}

function validateItemPayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getItemPayloadSchema(isUpdate), payload);
}

module.exports = {
  validateSessionPayload,
  validateItemPayload,
  validateSessionId,
  isNumericId,
};
