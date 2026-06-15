const { allowedFields } = require('./detalleCompras.schemas');

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

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!isNumericId(clean.Id_Com)) {
      errors.push('Id_Com is required and must be a positive integer');
    }

    if (clean.Pre_Uni_Dco === undefined || clean.Pre_Uni_Dco === null || clean.Pre_Uni_Dco === '') {
      errors.push('Pre_Uni_Dco is required');
    }

    if (clean.Sub_Tot_Dco === undefined || clean.Sub_Tot_Dco === null || clean.Sub_Tot_Dco === '') {
      errors.push('Sub_Tot_Dco is required');
    }
  }

  if (clean.Id_Com !== undefined) {
    const idCompra = Number(clean.Id_Com);
    if (!Number.isInteger(idCompra) || idCompra <= 0) {
      errors.push('Id_Com must be a positive integer');
    } else {
      clean.Id_Com = idCompra;
    }
  }

  if (clean.Id_Prd !== undefined) {
    if (clean.Id_Prd === null || clean.Id_Prd === '') {
      clean.Id_Prd = null;
    } else {
      const idProducto = Number(clean.Id_Prd);
      if (!Number.isInteger(idProducto) || idProducto <= 0) {
        errors.push('Id_Prd must be a positive integer or null');
      } else {
        clean.Id_Prd = idProducto;
      }
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

  if (clean.Can_Dco !== undefined) {
    const cantidad = Number(clean.Can_Dco);
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      errors.push('Can_Dco must be an integer greater or equal to 1');
    } else {
      clean.Can_Dco = cantidad;
    }
  }

  const numericFields = ['Pre_Uni_Dco', 'Sub_Tot_Dco'];
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

  clean.Not_Dco = normalizeOptionalString(clean.Not_Dco);

  if (clean.Pre_Uni_Dco !== undefined && clean.Sub_Tot_Dco !== undefined) {
    const cantidad = clean.Can_Dco ?? 1;
    const expected = Number((cantidad * clean.Pre_Uni_Dco).toFixed(2));
    const received = Number(clean.Sub_Tot_Dco.toFixed(2));
    if (Math.abs(expected - received) > 0.01) {
      errors.push('Sub_Tot_Dco must match Can_Dco * Pre_Uni_Dco');
    }
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
