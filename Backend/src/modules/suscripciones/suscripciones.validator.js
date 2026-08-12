const { estados, allowedFields } = require('./suscripciones.schemas');
const { toEcuadorDateTime } = require('../../utils/dateHelper');
const {
  z,
  validationResult,
  isNumericId,
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
    Id_Cli: z.any().optional(),
    Id_Rev: z.any().optional(),
    Id_Prd: isUpdate ? z.any().optional() : z.any().refine((value) => isNumericId(value), { message: 'Id_Prd is required and must be a positive integer' }),
    Id_Var: z.any().optional(),
    Fec_Ini_Sus: isUpdate ? z.any().optional() : z.any().refine((value) => value !== undefined && value !== null && value !== '', { message: 'Fec_Ini_Sus is required' }),
    Fec_Fin_Sus: z.any().optional(),
    Est_Sus: z.enum(estados).optional().refine((value) => value === undefined || estados.includes(value), {
      message: 'Est_Sus must be activa, suspendida, cancelada or expirada',
    }),
    Ren_Auto: optionalTinyIntBoolean,
    Not_Sus: optionalTrimmedNullableString,
    Cor_Cue_Sus: optionalTrimmedNullableString,
  }).passthrough().transform((payload) => {
    const clean = pickAllowed(payload);
    const errors = [];

    if (clean.Id_Cli !== undefined) {
      if (clean.Id_Cli === null || clean.Id_Cli === '') {
        clean.Id_Cli = null;
      } else {
        // Solo IDs numericos: clientes.identity ya no resuelve UUIDs (eran del
        // ecommerce retirado).
        const idCli = Number(clean.Id_Cli);
        if (!Number.isInteger(idCli) || idCli <= 0) {
          errors.push('Id_Cli must be a positive integer or null');
        } else {
          clean.Id_Cli = idCli;
        }
      }
    }

    if (clean.Id_Rev !== undefined) {
      if (clean.Id_Rev === null || clean.Id_Rev === '') {
        clean.Id_Rev = null;
      } else {
        const idRev = Number(clean.Id_Rev);
        if (!Number.isInteger(idRev) || idRev <= 0) {
          errors.push('Id_Rev must be a positive integer or null');
        } else {
          clean.Id_Rev = idRev;
        }
      }
    }

    // El titular es un cliente final O un revendedor, nunca ambos ni ninguno
    // (lo respalda la CHECK chk_suscripciones_titular). En un update parcial
    // que no toca ninguno de los dos, la comprobacion la hace el service sobre
    // el payload ya mezclado con la fila actual.
    const tocaTitular = clean.Id_Cli !== undefined || clean.Id_Rev !== undefined;
    if (!isUpdate || tocaTitular) {
      const tieneCliente = clean.Id_Cli !== undefined && clean.Id_Cli !== null;
      const tieneRevendedor = clean.Id_Rev !== undefined && clean.Id_Rev !== null;

      if (tieneCliente && tieneRevendedor) {
        errors.push('Una suscripcion no puede tener cliente y revendedor a la vez');
      } else if (!tieneCliente && !tieneRevendedor) {
        errors.push('Debe indicar el titular de la suscripcion: Id_Cli o Id_Rev');
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

    // Asignar solo cuando el campo viene en el payload: hacerlo siempre crearia
    // la clave con valor undefined y, al mezclar el update parcial con la fila
    // actual, borraria la fecha existente.
    for (const campo of ['Fec_Ini_Sus', 'Fec_Fin_Sus']) {
      if (clean[campo] !== undefined) {
        clean[campo] = normalizeDateTime(clean[campo], campo, errors);
      }
    }

    // Formato laxo a proposito: es el correo que dicta el revendedor y a veces
    // llega con mayusculas o espacios. Se normaliza en minusculas pero no se
    // rechaza, para no bloquear una venta por un correo raro.
    if (clean.Cor_Cue_Sus) {
      const correo = String(clean.Cor_Cue_Sus).trim().toLowerCase();
      if (correo.length > 150) {
        errors.push('Cor_Cue_Sus cannot exceed 150 characters');
      } else if (!correo.includes('@')) {
        errors.push('Cor_Cue_Sus must be a valid email');
      } else {
        clean.Cor_Cue_Sus = correo;
      }
    }

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
