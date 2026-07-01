const { allowedFields } = require('./proveedoresProductos.schemas');
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

function getProveedoresProductosPayloadSchema(isUpdate) {
  return z.object({
    Id_Pro: z.any().optional(),
    Id_Prd: z.any().optional(),
    Id_Var: z.any().optional(),
    Pre_Com_Pro_Prd: z.any().optional(),
    Es_Pri_Pro_Prd: optionalTinyIntBoolean,
    Not_Pro_Prd: optionalTrimmedNullableString,
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Pro)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Pro'], message: 'Id_Pro is required and must be a positive integer' });
      }

      if (!isNumericId(payload.Id_Prd) && !isNumericId(payload.Id_Var)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd or Id_Var is required and at least one must be a positive integer' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Id_Pro !== undefined) {
      const proveedorId = Number(clean.Id_Pro);
      if (!Number.isInteger(proveedorId) || proveedorId <= 0) {
        errors.push('Id_Pro must be a positive integer');
      } else {
        clean.Id_Pro = proveedorId;
      }
    }

    for (const field of ['Id_Prd', 'Id_Var']) {
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

    if (clean.Pre_Com_Pro_Prd !== undefined) {
      if (clean.Pre_Com_Pro_Prd === null || clean.Pre_Com_Pro_Prd === '') {
        clean.Pre_Com_Pro_Prd = null;
      } else {
        const price = Number(clean.Pre_Com_Pro_Prd);
        if (Number.isNaN(price) || price < 0) {
          errors.push('Pre_Com_Pro_Prd must be a number greater or equal to 0');
        } else {
          clean.Pre_Com_Pro_Prd = price;
        }
      }
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getProveedoresProductosPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
