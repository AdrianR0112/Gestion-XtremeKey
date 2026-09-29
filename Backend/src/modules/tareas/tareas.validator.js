const { prioridadesTarea, estadosTarea, allowedFields } = require('./tareas.schemas');
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

const { toEcuadorDateTime } = require('../../utils/dateHelper');

function normalizeDate(value, fieldName, errors) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid date`);
    return value;
  }

  return toEcuadorDateTime(date).slice(0, 10);
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

function getTareasPayloadSchema(isUpdate) {
  return z.object({
    Tit_Tar: z.any().optional(),
    Des_Tar: optionalTrimmedNullableString,
    Id_Cli: z.any().optional(),
    Id_Ven: z.any().optional(),
    Fec_Lim_Tar: z.any().optional(),
    Fec_Com_Tar: z.any().optional(),
    Pri_Tar: z.any().optional(),
    Pro_Tar: z.any().optional(),
    Est_Tar: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate && (!payload.Tit_Tar || String(payload.Tit_Tar).trim() === '')) {
      ctx.addIssue({ code: 'custom', path: ['Tit_Tar'], message: 'Tit_Tar is required' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Tit_Tar !== undefined) {
      clean.Tit_Tar = String(clean.Tit_Tar).trim();
      if (clean.Tit_Tar === '') {
        errors.push('Tit_Tar cannot be empty');
      } else if (clean.Tit_Tar.length > 200) {
        errors.push('Tit_Tar cannot exceed 200 characters');
      }
    }

    for (const field of ['Id_Cli', 'Id_Ven']) {
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

    clean.Fec_Lim_Tar = normalizeDate(clean.Fec_Lim_Tar, 'Fec_Lim_Tar', errors);
    clean.Fec_Com_Tar = normalizeDateTime(clean.Fec_Com_Tar, 'Fec_Com_Tar', errors);

    if (clean.Pri_Tar !== undefined && !prioridadesTarea.includes(clean.Pri_Tar)) {
      errors.push('Pri_Tar must be baja, media, alta or urgente');
    }

    if (clean.Pro_Tar !== undefined) {
      const progress = Number(clean.Pro_Tar);
      if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
        errors.push('Pro_Tar must be an integer between 0 and 100');
      } else {
        clean.Pro_Tar = progress;
      }
    }

    if (clean.Est_Tar !== undefined && !estadosTarea.includes(clean.Est_Tar)) {
      errors.push('Est_Tar must be pendiente, en_progreso, completada or cancelada');
    }

    if (clean.Est_Tar === 'completada') {
      if (clean.Pro_Tar === undefined) {
        clean.Pro_Tar = 100;
      } else if (clean.Pro_Tar !== 100) {
        errors.push('Pro_Tar must be 100 when Est_Tar is completada');
      }
    }

    if (clean.Pro_Tar === 100) {
      if (clean.Est_Tar === undefined) {
        clean.Est_Tar = 'completada';
      } else if (clean.Est_Tar !== 'completada') {
        errors.push('Est_Tar must be completada when Pro_Tar is 100');
      }
    }

    if (clean.Fec_Com_Tar !== undefined && clean.Est_Tar !== undefined && clean.Est_Tar !== 'completada') {
      errors.push('Fec_Com_Tar can only be set when Est_Tar is completada');
    }

    if (clean.Est_Tar === 'completada' && clean.Fec_Com_Tar === undefined) {
      clean.Fec_Com_Tar = toEcuadorDateTime(new Date());
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getTareasPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
