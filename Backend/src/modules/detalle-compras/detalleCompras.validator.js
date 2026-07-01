const { allowedFields } = require('./detalleCompras.schemas');
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

function getDetalleComprasPayloadSchema(isUpdate) {
  return z.object({
    Id_Com: z.any().optional(),
    Id_Prd: z.any().optional(),
    Id_Var: z.any().optional(),
    Can_Dco: z.any().optional(),
    Pre_Uni_Dco: z.any().optional(),
    Sub_Tot_Dco: z.any().optional(),
    Not_Dco: optionalTrimmedNullableString,
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Com)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Com'], message: 'Id_Com is required and must be a positive integer' });
      }

      if (payload.Pre_Uni_Dco === undefined || payload.Pre_Uni_Dco === null || payload.Pre_Uni_Dco === '') {
        ctx.addIssue({ code: 'custom', path: ['Pre_Uni_Dco'], message: 'Pre_Uni_Dco is required' });
      }

      if (payload.Sub_Tot_Dco === undefined || payload.Sub_Tot_Dco === null || payload.Sub_Tot_Dco === '') {
        ctx.addIssue({ code: 'custom', path: ['Sub_Tot_Dco'], message: 'Sub_Tot_Dco is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Id_Com !== undefined) {
      const idCompra = Number(clean.Id_Com);
      if (!Number.isInteger(idCompra) || idCompra <= 0) {
        errors.push('Id_Com must be a positive integer');
      } else {
        clean.Id_Com = idCompra;
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

    if (clean.Can_Dco !== undefined) {
      const cantidad = Number(clean.Can_Dco);
      if (!Number.isInteger(cantidad) || cantidad < 1) {
        errors.push('Can_Dco must be an integer greater or equal to 1');
      } else {
        clean.Can_Dco = cantidad;
      }
    }

    for (const field of ['Pre_Uni_Dco', 'Sub_Tot_Dco']) {
      if (clean[field] !== undefined) {
        const value = Number(clean[field]);
        if (Number.isNaN(value) || value < 0) {
          errors.push(`${field} must be a number greater or equal to 0`);
        } else {
          clean[field] = value;
        }
      }
    }

    if (clean.Pre_Uni_Dco !== undefined && clean.Sub_Tot_Dco !== undefined) {
      const cantidad = clean.Can_Dco ?? 1;
      const expected = Number((cantidad * clean.Pre_Uni_Dco).toFixed(2));
      const received = Number(clean.Sub_Tot_Dco.toFixed(2));
      if (Math.abs(expected - received) > 0.01) {
        errors.push('Sub_Tot_Dco must match Can_Dco * Pre_Uni_Dco');
      }
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getDetalleComprasPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
