const {
  tiposPlantilla,
  canalesPlantilla,
  estadosPlantilla,
  allowedFields
} = require('./plantillasNotificacion.schemas');
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

function normalizeJson(value, fieldName, errors) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;

  if (typeof value === 'object') {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (_error) {
      errors.push(`${fieldName} must be valid JSON`);
      return value;
    }
  }

  errors.push(`${fieldName} must be an object, JSON string, or null`);
  return value;
}

function getPlantillasPayloadSchema(isUpdate) {
  return z.object({
    Nom_Pla: z.any().optional(),
    Tip_Pla: optionalTrimmedNullableString,
    Can_Pla: optionalTrimmedNullableString,
    Asu_Pla: optionalTrimmedNullableString,
    Cue_Pla: optionalTrimmedNullableString,
    Var_Pla: z.any().optional(),
    Est_Pla: optionalTrimmedNullableString,
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!payload.Nom_Pla || String(payload.Nom_Pla).trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['Nom_Pla'], message: 'Nom_Pla is required' });
      }

      if (payload.Cue_Pla === undefined || payload.Cue_Pla === null || String(payload.Cue_Pla).trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['Cue_Pla'], message: 'Cue_Pla is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Nom_Pla !== undefined) {
      clean.Nom_Pla = String(clean.Nom_Pla).trim();
      if (clean.Nom_Pla === '') {
        errors.push('Nom_Pla cannot be empty');
      } else if (clean.Nom_Pla.length > 150) {
        errors.push('Nom_Pla cannot exceed 150 characters');
      }
    }

    if (clean.Tip_Pla !== undefined && clean.Tip_Pla !== null && !tiposPlantilla.includes(clean.Tip_Pla)) {
      errors.push('Tip_Pla must be bienvenida, venta, renovacion, vencimiento, recordatorio or personalizado');
    }

    if (clean.Can_Pla !== undefined && clean.Can_Pla !== null && !canalesPlantilla.includes(clean.Can_Pla)) {
      errors.push('Can_Pla must be whatsapp, email, sms or push');
    }

    if (clean.Asu_Pla !== undefined && clean.Asu_Pla !== null && clean.Asu_Pla.length > 200) {
      errors.push('Asu_Pla cannot exceed 200 characters');
    }

    if (clean.Cue_Pla !== undefined && clean.Cue_Pla === null) {
      errors.push('Cue_Pla cannot be empty');
    }

    if (clean.Var_Pla !== undefined) {
      clean.Var_Pla = normalizeJson(clean.Var_Pla, 'Var_Pla', errors);
    }

    if (clean.Est_Pla !== undefined && clean.Est_Pla !== null && !estadosPlantilla.includes(clean.Est_Pla)) {
      errors.push('Est_Pla must be activo or inactivo');
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getPlantillasPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
