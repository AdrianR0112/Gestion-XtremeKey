const { estados, allowedFields } = require('./ventas.schemas');
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

function getVentasPayloadSchema(isUpdate) {
  return z.object({
    Id_Cli: z.any().optional(),
    Id_Rev: z.any().optional(),
    Fec_Ven: z.any().optional(),
    Des_Tot_Ven: z.any().optional(),
    Imp_Tot_Ven: z.any().optional(),
    Tot_Ven: z.any().optional(),
    Met_Pag_Ven: optionalTrimmedNullableString,
    Not_Ven: optionalTrimmedNullableString,
    Est_Ven: z.enum(estados).optional().refine((value) => value === undefined || estados.includes(value), {
      message: 'Est_Ven must be pendiente, completada, cancelada or reembolsada',
    }),
  }).passthrough().superRefine((payload, ctx) => {
    const hasCli = isNumericId(payload.Id_Cli);
    const hasRev = isNumericId(payload.Id_Rev);

    if (!isUpdate) {
      if (!hasCli && !hasRev) {
        ctx.addIssue({ code: 'custom', path: ['Id_Cli'], message: 'Debe especificar Id_Cli o Id_Rev (al menos uno requerido).' });
      }

      if (hasCli && hasRev) {
        ctx.addIssue({ code: 'custom', path: ['Id_Cli'], message: 'No puede especificar Id_Cli e Id_Rev al mismo tiempo.' });
      }

      if (payload.Tot_Ven === undefined || payload.Tot_Ven === null || payload.Tot_Ven === '') {
        ctx.addIssue({ code: 'custom', path: ['Tot_Ven'], message: 'Tot_Ven is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Id_Cli !== undefined) {
      if (clean.Id_Cli === null || clean.Id_Cli === '') {
        clean.Id_Cli = null;
      } else {
        const clientId = Number(clean.Id_Cli);
        if (!Number.isInteger(clientId) || clientId <= 0) {
          errors.push('Id_Cli must be a positive integer or null');
        } else {
          clean.Id_Cli = clientId;
        }
      }
    }

    if (clean.Id_Rev !== undefined) {
      if (clean.Id_Rev === null || clean.Id_Rev === '') {
        clean.Id_Rev = null;
      } else {
        const revId = Number(clean.Id_Rev);
        if (!Number.isInteger(revId) || revId <= 0) {
          errors.push('Id_Rev must be a positive integer or null');
        } else {
          clean.Id_Rev = revId;
        }
      }
    }

    clean.Fec_Ven = normalizeDateTime(clean.Fec_Ven, 'Fec_Ven', errors);

    const numericFields = ['Des_Tot_Ven', 'Imp_Tot_Ven', 'Tot_Ven'];
    for (const field of numericFields) {
      if (clean[field] !== undefined) {
        const value = Number(clean[field]);
        if (Number.isNaN(value) || value < 0) {
          errors.push(`${field} must be a number greater or equal to 0`);
        } else {
          clean[field] = value;
        }
      }
    }

    if (clean.Est_Ven === 'completada' && !clean.Met_Pag_Ven) {
      errors.push('Met_Pag_Ven is required when Est_Ven is completada');
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getVentasPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
