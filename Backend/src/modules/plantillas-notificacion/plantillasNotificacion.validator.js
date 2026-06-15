const {
  tiposPlantilla,
  canalesPlantilla,
  estadosPlantilla,
  allowedFields
} = require('./plantillasNotificacion.schemas');

function isNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

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

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!clean.Nom_Pla || String(clean.Nom_Pla).trim() === '') {
      errors.push('Nom_Pla is required');
    }

    if (clean.Cue_Pla === undefined || clean.Cue_Pla === null || String(clean.Cue_Pla).trim() === '') {
      errors.push('Cue_Pla is required');
    }
  }

  if (clean.Nom_Pla !== undefined) {
    clean.Nom_Pla = String(clean.Nom_Pla).trim();
    if (clean.Nom_Pla === '') {
      errors.push('Nom_Pla cannot be empty');
    } else if (clean.Nom_Pla.length > 150) {
      errors.push('Nom_Pla cannot exceed 150 characters');
    }
  }

  if (clean.Tip_Pla !== undefined) {
    clean.Tip_Pla = normalizeOptionalString(clean.Tip_Pla);
    if (clean.Tip_Pla !== null && !tiposPlantilla.includes(clean.Tip_Pla)) {
      errors.push('Tip_Pla must be bienvenida, venta, renovacion, vencimiento, recordatorio or personalizado');
    }
  }

  if (clean.Can_Pla !== undefined) {
    clean.Can_Pla = normalizeOptionalString(clean.Can_Pla);
    if (clean.Can_Pla !== null && !canalesPlantilla.includes(clean.Can_Pla)) {
      errors.push('Can_Pla must be whatsapp, email, sms or push');
    }
  }

  if (clean.Asu_Pla !== undefined) {
    clean.Asu_Pla = normalizeOptionalString(clean.Asu_Pla);
    if (clean.Asu_Pla !== null && clean.Asu_Pla.length > 200) {
      errors.push('Asu_Pla cannot exceed 200 characters');
    }
  }

  if (clean.Cue_Pla !== undefined) {
    clean.Cue_Pla = normalizeOptionalString(clean.Cue_Pla);
    if (clean.Cue_Pla === null || clean.Cue_Pla === '') {
      errors.push('Cue_Pla cannot be empty');
    }
  }

  if (clean.Var_Pla !== undefined) {
    clean.Var_Pla = normalizeJson(clean.Var_Pla, 'Var_Pla', errors);
  }

  if (clean.Est_Pla !== undefined) {
    clean.Est_Pla = normalizeOptionalString(clean.Est_Pla);
    if (clean.Est_Pla !== null && !estadosPlantilla.includes(clean.Est_Pla)) {
      errors.push('Est_Pla must be activo or inactivo');
    }
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
