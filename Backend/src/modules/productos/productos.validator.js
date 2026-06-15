const { tiposProducto, estados, allowedFields } = require('./productos.schemas');

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

function normalizeTinyInt(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return 0;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return Number(value) === 1 ? 1 : 0;
}

function normalizeImage(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return String(value).trim() || null;
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!clean.Nom_Prd || String(clean.Nom_Prd).trim() === '') {
      errors.push('Nom_Prd is required');
    }

  }

  if (clean.Nom_Prd !== undefined) {
    clean.Nom_Prd = String(clean.Nom_Prd).trim();
    if (clean.Nom_Prd === '') {
      errors.push('Nom_Prd cannot be empty');
    }
  }

  clean.Cod_Prd = normalizeOptionalString(clean.Cod_Prd);
  clean.Des_Prd = normalizeOptionalString(clean.Des_Prd);
  clean.Des_Cor_Prd = normalizeOptionalString(clean.Des_Cor_Prd);

  if (clean.Id_Cat !== undefined) {
    if (clean.Id_Cat === null || clean.Id_Cat === '') {
      clean.Id_Cat = null;
    } else {
      const categoryId = Number(clean.Id_Cat);
      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        errors.push('Id_Cat must be a positive integer or null');
      } else {
        clean.Id_Cat = categoryId;
      }
    }
  }

  if (clean.Tip_Prd !== undefined && !tiposProducto.includes(clean.Tip_Prd)) {
    errors.push('Tip_Prd must be servicio, producto or suscripcion');
  }

  if (clean.Est_Prd !== undefined && !estados.includes(clean.Est_Prd)) {
    errors.push('Est_Prd must be activo, inactivo or agotado');
  }

  try {
    const image = normalizeImage(clean.Ima_Prd);
    if (image !== undefined) {
      clean.Ima_Prd = image;
    }
  } catch (error) {
    errors.push(error.message);
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
