const { estados, allowedFields } = require('./suscripciones.schemas');
const { toEcuadorDateTime } = require('../../utils/dateHelper');
const {
  z,
  validationResult,
  isNumericId,
  isClientReference,
  optionalTrimmedNullableString,
  optionalTinyIntBoolean,
} = require('../../utils/zod');

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

function getSuscripcionPayloadSchema(isUpdate) {
  return z.object({
    Id_Cli: isUpdate ? z.any().optional() : z.any().refine((value) => isClientReference(value), { message: 'Id_Cli is required and must be a positive integer or UUID' }),
    Id_Prd: isUpdate ? z.any().optional() : z.any().refine((value) => isNumericId(value), { message: 'Id_Prd is required and must be a positive integer' }),
    Id_Var: z.any().optional(),
    Fec_Ini_Sus: isUpdate ? z.any().optional() : z.any().refine((value) => value !== undefined && value !== null && value !== '', { message: 'Fec_Ini_Sus is required' }),
    Fec_Fin_Sus: z.any().optional(),
    Est_Sus: z.enum(estados).optional().refine((value) => value === undefined || estados.includes(value), {
      message: 'Est_Sus must be activa, suspendida, cancelada or expirada',
    }),
    Ren_Auto: optionalTinyIntBoolean,
    Not_Sus: optionalTrimmedNullableString,
  }).passthrough().transform((payload) => {
    const clean = pickAllowed(payload);
    const errors = [];

    if (clean.Id_Cli !== undefined) {
      if (clean.Id_Cli === null || clean.Id_Cli === '') {
        clean.Id_Cli = null;
      } else {
        const clientReference = String(clean.Id_Cli).trim();
        if (!isClientReference(clientReference)) {
          errors.push('Id_Cli must be a positive integer or UUID');
        } else {
          clean.Id_Cli = clientReference;
        }
      }
    }

    if (clean.Id_Prd !== undefined) {
      const value = Number(clean.Id_Prd);
      if (!Number.isInteger(value) || value <= 0) {
        errors.push('Id_Prd must be a positive integer');
      } else {
        clean.Id_Prd = value;
      }
    }

    if (clean.Id_Var !== undefined) {
      if (clean.Id_Var === null || clean.Id_Var === '') {
        clean.Id_Var = null;
      } else {
        const idVar = Number(clean.Id_Var);
        if (!Number.isInteger(idVar) || idVar <= 0) {
          errors.push('Id_Var must be a positive integer or null');
        } else {
          clean.Id_Var = idVar;
        }
      }
    }

    clean.Fec_Ini_Sus = normalizeDateTime(clean.Fec_Ini_Sus, 'Fec_Ini_Sus', errors);
    clean.Fec_Fin_Sus = normalizeDateTime(clean.Fec_Fin_Sus, 'Fec_Fin_Sus', errors);

    if (clean.Fec_Ini_Sus && clean.Fec_Fin_Sus) {
      const start = new Date(clean.Fec_Ini_Sus);
      const end = new Date(clean.Fec_Fin_Sus);
      if (end < start) {
        errors.push('Fec_Fin_Sus cannot be earlier than Fec_Ini_Sus');
      }
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getSuscripcionPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
