const { tiposRenovacion, estadosRenovacion, allowedFields } = require('./renovaciones.schemas');
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

function normalizeOptionalString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function normalizeDate(value, fieldName, errors, required = false) {
  if (value === undefined) {
    if (required) errors.push(`${fieldName} is required`);
    return undefined;
  }

  if (value === null || value === '') {
    if (required) errors.push(`${fieldName} is required`);
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid date`);
    return value;
  }

  return toEcuadorDateTime(date).slice(0, 10);
}

function getRenovacionesPayloadSchema(isUpdate) {
  return z.object({
    Id_Dve_Ori: z.any().optional(),
    Id_Dve_Nue: z.any().optional(),
    Id_Cli: z.any().optional(),
    Id_Prd: z.any().optional(),
    Id_Var: z.any().optional(),
    Fec_Ven_Ant_Ren: z.any().optional(),
    Fec_Ini_Nue_Ren: z.any().optional(),
    Fec_Fin_Nue_Ren: z.any().optional(),
    Pre_Ori_Ren: z.any().optional(),
    Pre_Ren: z.any().optional(),
    Des_Ren: z.any().optional(),
    Tip_Ren: optionalTrimmedNullableString,
    Est_Ren: optionalTrimmedNullableString,
    Not_Ren: optionalTrimmedNullableString,
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Dve_Ori)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Dve_Ori'], message: 'Id_Dve_Ori is required and must be a positive integer' });
      }

      if (!isNumericId(payload.Id_Cli)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Cli'], message: 'Id_Cli is required and must be a positive integer' });
      }

      if (!isNumericId(payload.Id_Prd) && !isNumericId(payload.Id_Var)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd or Id_Var is required and at least one must be a positive integer' });
      }

      if (payload.Fec_Ven_Ant_Ren === undefined || payload.Fec_Ven_Ant_Ren === null || payload.Fec_Ven_Ant_Ren === '') {
        ctx.addIssue({ code: 'custom', path: ['Fec_Ven_Ant_Ren'], message: 'Fec_Ven_Ant_Ren is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Id_Dve_Ori !== undefined) {
      const idOri = Number(clean.Id_Dve_Ori);
      if (!Number.isInteger(idOri) || idOri <= 0) {
        errors.push('Id_Dve_Ori must be a positive integer');
      } else {
        clean.Id_Dve_Ori = idOri;
      }
    }

    if (clean.Id_Dve_Nue !== undefined) {
      if (clean.Id_Dve_Nue === null || clean.Id_Dve_Nue === '') {
        clean.Id_Dve_Nue = null;
      } else {
        const idNue = Number(clean.Id_Dve_Nue);
        if (!Number.isInteger(idNue) || idNue <= 0) {
          errors.push('Id_Dve_Nue must be a positive integer or null');
        } else {
          clean.Id_Dve_Nue = idNue;
        }
      }
    }

    if (clean.Id_Cli !== undefined) {
      const idCli = Number(clean.Id_Cli);
      if (!Number.isInteger(idCli) || idCli <= 0) {
        errors.push('Id_Cli must be a positive integer');
      } else {
        clean.Id_Cli = idCli;
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

    clean.Fec_Ven_Ant_Ren = normalizeDate(clean.Fec_Ven_Ant_Ren, 'Fec_Ven_Ant_Ren', errors, !isUpdate);
    clean.Fec_Ini_Nue_Ren = normalizeDate(clean.Fec_Ini_Nue_Ren, 'Fec_Ini_Nue_Ren', errors, false);
    clean.Fec_Fin_Nue_Ren = normalizeDate(clean.Fec_Fin_Nue_Ren, 'Fec_Fin_Nue_Ren', errors, false);

    for (const field of ['Pre_Ori_Ren', 'Pre_Ren', 'Des_Ren']) {
      if (clean[field] !== undefined) {
        const value = Number(clean[field]);
        if (Number.isNaN(value) || value < 0) {
          errors.push(`${field} must be a number greater or equal to 0`);
        } else {
          clean[field] = Number(value.toFixed(2));
        }
      }
    }

    if (clean.Tip_Ren !== undefined && !tiposRenovacion.includes(clean.Tip_Ren)) {
      errors.push('Tip_Ren must be automatica, manual or anticipada');
    }

    if (clean.Est_Ren !== undefined && !estadosRenovacion.includes(clean.Est_Ren)) {
      errors.push('Est_Ren must be pendiente, completada, rechazada or expirada');
    }

    if (clean.Fec_Ini_Nue_Ren && clean.Fec_Fin_Nue_Ren) {
      const start = new Date(clean.Fec_Ini_Nue_Ren);
      const end = new Date(clean.Fec_Fin_Nue_Ren);
      if (end < start) {
        errors.push('Fec_Fin_Nue_Ren cannot be earlier than Fec_Ini_Nue_Ren');
      }
    }

    if (clean.Pre_Ori_Ren !== undefined && clean.Pre_Ren !== undefined && clean.Des_Ren !== undefined) {
      const expected = Number((clean.Pre_Ori_Ren - clean.Des_Ren).toFixed(2));
      const received = Number(clean.Pre_Ren.toFixed(2));
      if (expected < 0) {
        errors.push('Des_Ren cannot be greater than Pre_Ori_Ren');
      } else if (Math.abs(expected - received) > 0.01) {
        errors.push('Pre_Ren must equal Pre_Ori_Ren - Des_Ren');
      }
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getRenovacionesPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
