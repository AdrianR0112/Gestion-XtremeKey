const { allowedFields } = require('./proveedoresProductos.schemas');

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

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!isNumericId(clean.Id_Pro)) {
      errors.push('Id_Pro is required and must be a positive integer');
    }
  }

  if (clean.Id_Pro !== undefined) {
    const proveedorId = Number(clean.Id_Pro);
    if (!Number.isInteger(proveedorId) || proveedorId <= 0) {
      errors.push('Id_Pro must be a positive integer');
    } else {
      clean.Id_Pro = proveedorId;
    }
  }

  if (clean.Id_Prd !== undefined) {
    if (clean.Id_Prd === null || clean.Id_Prd === '') {
      clean.Id_Prd = null;
    } else {
      const productId = Number(clean.Id_Prd);
      if (!Number.isInteger(productId) || productId <= 0) {
        errors.push('Id_Prd must be a positive integer or null');
      } else {
        clean.Id_Prd = productId;
      }
    }
  }

  if (clean.Id_Var !== undefined) {
    if (clean.Id_Var === null || clean.Id_Var === '') {
      clean.Id_Var = null;
    } else {
      const variantId = Number(clean.Id_Var);
      if (!Number.isInteger(variantId) || variantId <= 0) {
        errors.push('Id_Var must be a positive integer or null');
      } else {
        clean.Id_Var = variantId;
      }
    }
  }

  if (!isUpdate && !isNumericId(clean.Id_Prd) && !isNumericId(clean.Id_Var)) {
    errors.push('Id_Prd or Id_Var is required and at least one must be a positive integer');
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

  if (clean.Es_Pri_Pro_Prd !== undefined) {
    clean.Es_Pri_Pro_Prd = normalizeTinyInt(clean.Es_Pri_Pro_Prd);
  }

  clean.Not_Pro_Prd = normalizeOptionalString(clean.Not_Pro_Prd);

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
