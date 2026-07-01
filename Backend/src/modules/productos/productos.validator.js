const { tiposProducto, estados, estadosTienda, allowedFields } = require('./productos.schemas');
const { z, validationResult, isNumericId, optionalTrimmedNullableString, optionalTinyIntBoolean } = require('../../utils/zod');

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

function normalizeImage(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return String(value).trim() || null;
}

function normalizeSlug(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return String(value).trim().toLowerCase() || null;
}

function getProductosPayloadSchema(isUpdate) {
  return z.object({
    Nom_Prd: z.any().optional(),
    Cod_Prd: optionalTrimmedNullableString,
      Des_Prd: optionalTrimmedNullableString,
      Des_Cor_Prd: optionalTrimmedNullableString,
      Slug_Prd: optionalTrimmedNullableString,
      Precio_Venta: z.any().optional(),
      Precio_Regular: z.any().optional(),
      Id_Cat: z.any().optional(),
      Tip_Prd: z.any().optional(),
      Est_Prd: z.any().optional(),
      Estado_Tienda: z.any().optional(),
      Es_Destacado: optionalTinyIntBoolean,
      Meta_Titulo: optionalTrimmedNullableString,
      Meta_Descripcion: optionalTrimmedNullableString,
      Ima_Prd: z.any().optional(),
    }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate && (!payload.Nom_Prd || String(payload.Nom_Prd).trim() === '')) {
      ctx.addIssue({ code: 'custom', path: ['Nom_Prd'], message: 'Nom_Prd is required' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload);

    if (clean.Nom_Prd !== undefined) {
      clean.Nom_Prd = String(clean.Nom_Prd).trim();
      if (clean.Nom_Prd === '') {
        errors.push('Nom_Prd cannot be empty');
      }
    }

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

    clean.Slug_Prd = normalizeSlug(clean.Slug_Prd);

    for (const field of ['Precio_Venta', 'Precio_Regular']) {
      if (clean[field] !== undefined) {
        if (clean[field] === null || clean[field] === '') {
          clean[field] = null;
          continue;
        }

        const value = Number(clean[field]);
        if (Number.isNaN(value) || value < 0) {
          errors.push(`${field} must be a number greater or equal to 0`);
        } else {
          clean[field] = value;
        }
      }
    }

    if (clean.Tip_Prd !== undefined && !tiposProducto.includes(clean.Tip_Prd)) {
      errors.push('Tip_Prd must be servicio, producto or suscripcion');
    }

    if (clean.Est_Prd !== undefined && !estados.includes(clean.Est_Prd)) {
      errors.push('Est_Prd must be activo, inactivo or agotado');
    }

    if (clean.Estado_Tienda !== undefined && !estadosTienda.includes(clean.Estado_Tienda)) {
      errors.push('Estado_Tienda must be borrador, activo or archivado');
    }

    clean.Ima_Prd = normalizeImage(clean.Ima_Prd);

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getProductosPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
