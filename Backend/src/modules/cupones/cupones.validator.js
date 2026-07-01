const { z, validationResult, isNumericId, optionalTrimmedNullableString, optionalTinyIntBoolean } = require('../../utils/zod');
const { pickAllowed, normalizeDateTime, normalizePositiveInteger, normalizeDecimal } = require('../../utils/entityHelpers');
const { tiposCupon, estadosCupon, aplicaA, couponAllowedFields, usageAllowedFields } = require('./cupones.schemas');

function getCouponPayloadSchema(isUpdate) {
  return z.object({
    Codigo_Cup: z.any().optional(),
    Descripcion_Cup: optionalTrimmedNullableString,
    Tipo_Cup: z.any().optional(),
    Monto_Descuento: z.any().optional(),
    Minimo_Carrito: z.any().optional(),
    Maximo_Descuento: z.any().optional(),
    Fecha_Desde: z.any().optional(),
    Fecha_Hasta: z.any().optional(),
    Limite_Uso: z.any().optional(),
    Limite_Uso_Por_Usuario: z.any().optional(),
    Veces_Usado: z.any().optional(),
    Esta_Activo: optionalTinyIntBoolean,
    Estado_Cup: z.any().optional(),
    Aplica_A: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!payload.Codigo_Cup || String(payload.Codigo_Cup).trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['Codigo_Cup'], message: 'Codigo_Cup is required' });
      }
      if (!payload.Fecha_Desde) {
        ctx.addIssue({ code: 'custom', path: ['Fecha_Desde'], message: 'Fecha_Desde is required' });
      }
      if (!payload.Fecha_Hasta) {
        ctx.addIssue({ code: 'custom', path: ['Fecha_Hasta'], message: 'Fecha_Hasta is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, couponAllowedFields);

    if (clean.Codigo_Cup !== undefined) {
      clean.Codigo_Cup = String(clean.Codigo_Cup).trim();
      if (clean.Codigo_Cup === '') errors.push('Codigo_Cup cannot be empty');
    }

    clean.Monto_Descuento = normalizeDecimal(clean.Monto_Descuento, 'Monto_Descuento', errors, { allowNull: false });
    clean.Minimo_Carrito = normalizeDecimal(clean.Minimo_Carrito, 'Minimo_Carrito', errors, { allowNull: false });
    clean.Maximo_Descuento = normalizeDecimal(clean.Maximo_Descuento, 'Maximo_Descuento', errors, { allowNull: true });
    clean.Fecha_Desde = normalizeDateTime(clean.Fecha_Desde, 'Fecha_Desde', errors);
    clean.Fecha_Hasta = normalizeDateTime(clean.Fecha_Hasta, 'Fecha_Hasta', errors);
    clean.Limite_Uso = normalizePositiveInteger(clean.Limite_Uso, 'Limite_Uso', errors, { allowNull: true });
    clean.Limite_Uso_Por_Usuario = normalizePositiveInteger(clean.Limite_Uso_Por_Usuario, 'Limite_Uso_Por_Usuario', errors, { allowNull: false, min: 1 });
    clean.Veces_Usado = normalizePositiveInteger(clean.Veces_Usado, 'Veces_Usado', errors, { allowNull: false, min: 0 });

    if (clean.Tipo_Cup !== undefined && !tiposCupon.includes(clean.Tipo_Cup)) {
      errors.push('Tipo_Cup must be porcentaje or fijo');
    }

    if (clean.Estado_Cup !== undefined && !estadosCupon.includes(clean.Estado_Cup)) {
      errors.push('Estado_Cup must be activo, inactivo, expirado or programado');
    }

    if (clean.Aplica_A !== undefined && !aplicaA.includes(clean.Aplica_A)) {
      errors.push('Aplica_A must be todos, productos_especificos or categorias_especificas');
    }

    if (clean.Fecha_Desde && clean.Fecha_Hasta && clean.Fecha_Desde > clean.Fecha_Hasta) {
      errors.push('Fecha_Hasta must be greater or equal to Fecha_Desde');
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function getUsagePayloadSchema(isUpdate) {
  return z.object({
    Id_Cup: z.any().optional(),
    Id_Cli: z.any().optional(),
    Id_Ord: z.any().optional(),
    Descuento_Aplicado: z.any().optional(),
    Usado_En: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Cup)) ctx.addIssue({ code: 'custom', path: ['Id_Cup'], message: 'Id_Cup is required and must be a positive integer' });
      if (!isNumericId(payload.Id_Cli)) ctx.addIssue({ code: 'custom', path: ['Id_Cli'], message: 'Id_Cli is required and must be a positive integer' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, usageAllowedFields);

    clean.Id_Cup = normalizePositiveInteger(clean.Id_Cup, 'Id_Cup', errors);
    clean.Id_Cli = normalizePositiveInteger(clean.Id_Cli, 'Id_Cli', errors);
    clean.Id_Ord = normalizePositiveInteger(clean.Id_Ord, 'Id_Ord', errors, { allowNull: true });
    clean.Descuento_Aplicado = normalizeDecimal(clean.Descuento_Aplicado, 'Descuento_Aplicado', errors, { allowNull: false });
    clean.Usado_En = normalizeDateTime(clean.Usado_En, 'Usado_En', errors);

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validateCouponPayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getCouponPayloadSchema(isUpdate), payload);
}

function validateUsagePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getUsagePayloadSchema(isUpdate), payload);
}

module.exports = { validateCouponPayload, validateUsagePayload, isNumericId };
