const { z, validationResult, isNumericId, optionalTrimmedNullableString } = require('../../utils/zod');
const {
  pickAllowed,
  normalizeDateTime,
  normalizePositiveInteger,
  normalizeDecimal,
  normalizeJsonValue,
} = require('../../utils/entityHelpers');
const { estadosOrden, estadosPago, estadosItem, orderAllowedFields, itemAllowedFields } = require('./ordenes.schemas');

function getOrderPayloadSchema(isUpdate) {
  return z.object({
    Numero_Ord: z.any().optional(),
    Id_Cli: z.any().optional(),
    Email_Invitado: optionalTrimmedNullableString,
    Estado_Ord: z.any().optional(),
    Estado_Pago: z.any().optional(),
    Moneda: optionalTrimmedNullableString,
    Subtotal: z.any().optional(),
    Descuento: z.any().optional(),
    Total: z.any().optional(),
    Id_Cupon: z.any().optional(),
    Codigo_Cupon: optionalTrimmedNullableString,
    Notas_Cliente: optionalTrimmedNullableString,
    Notas_Internas: optionalTrimmedNullableString,
    Metadatos: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!payload.Numero_Ord || String(payload.Numero_Ord).trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['Numero_Ord'], message: 'Numero_Ord is required' });
      }

      if (payload.Subtotal === undefined || payload.Subtotal === null || payload.Subtotal === '') {
        ctx.addIssue({ code: 'custom', path: ['Subtotal'], message: 'Subtotal is required' });
      }

      if (payload.Total === undefined || payload.Total === null || payload.Total === '') {
        ctx.addIssue({ code: 'custom', path: ['Total'], message: 'Total is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, orderAllowedFields);

    if (clean.Numero_Ord !== undefined) {
      clean.Numero_Ord = String(clean.Numero_Ord).trim();
      if (clean.Numero_Ord === '') {
        errors.push('Numero_Ord cannot be empty');
      }
    }

    clean.Id_Cli = normalizePositiveInteger(clean.Id_Cli, 'Id_Cli', errors, { allowNull: true });
    clean.Id_Cupon = normalizePositiveInteger(clean.Id_Cupon, 'Id_Cupon', errors, { allowNull: true });
    clean.Subtotal = normalizeDecimal(clean.Subtotal, 'Subtotal', errors);
    clean.Descuento = normalizeDecimal(clean.Descuento, 'Descuento', errors, { allowNull: false });
    clean.Total = normalizeDecimal(clean.Total, 'Total', errors);
    clean.Metadatos = normalizeJsonValue(clean.Metadatos, 'Metadatos', errors);

    if (clean.Email_Invitado !== undefined && clean.Email_Invitado !== null) {
      const emailResult = z.string().email().safeParse(clean.Email_Invitado);
      if (!emailResult.success) {
        errors.push('Email_Invitado must be a valid email');
      }
    }

    if (clean.Estado_Ord !== undefined && !estadosOrden.includes(clean.Estado_Ord)) {
      errors.push('Estado_Ord must be pendiente, pagada, completada, cancelada or reembolsada');
    }

    if (clean.Estado_Pago !== undefined && !estadosPago.includes(clean.Estado_Pago)) {
      errors.push('Estado_Pago must be pendiente, pagado, fallido, reembolsado or parcial');
    }

    if (clean.Subtotal !== undefined && clean.Total !== undefined) {
      const descuento = clean.Descuento ?? 0;
      const expected = Number((clean.Subtotal - descuento).toFixed(2));
      const received = Number(clean.Total.toFixed(2));
      if (Math.abs(expected - received) > 0.01) {
        errors.push('Total must match Subtotal - Descuento');
      }
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function getOrderItemPayloadSchema(isUpdate) {
  return z.object({
    Id_Prd: z.any().optional(),
    Id_Var: z.any().optional(),
    Id_Key: z.any().optional(),
    Id_Cue: z.any().optional(),
    Nombre_Prd: z.any().optional(),
    Nombre_Var: optionalTrimmedNullableString,
    Precio_Unitario: z.any().optional(),
    Cantidad: z.any().optional(),
    Precio_Total: z.any().optional(),
    Descuento_Item: z.any().optional(),
    Clave_Licencia: optionalTrimmedNullableString,
    Correo_Asociado: optionalTrimmedNullableString,
    Contrasena_Asociada: optionalTrimmedNullableString,
    Fec_Ini_Licencia: z.any().optional(),
    Fec_Fin_Licencia: z.any().optional(),
    Estado_Item: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Prd)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Prd'], message: 'Id_Prd is required and must be a positive integer' });
      }

      if (!payload.Nombre_Prd || String(payload.Nombre_Prd).trim() === '') {
        ctx.addIssue({ code: 'custom', path: ['Nombre_Prd'], message: 'Nombre_Prd is required' });
      }

      if (payload.Precio_Unitario === undefined || payload.Precio_Unitario === null || payload.Precio_Unitario === '') {
        ctx.addIssue({ code: 'custom', path: ['Precio_Unitario'], message: 'Precio_Unitario is required' });
      }

      if (payload.Precio_Total === undefined || payload.Precio_Total === null || payload.Precio_Total === '') {
        ctx.addIssue({ code: 'custom', path: ['Precio_Total'], message: 'Precio_Total is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, itemAllowedFields);

    for (const field of ['Id_Prd', 'Id_Var', 'Id_Key', 'Id_Cue']) {
      clean[field] = normalizePositiveInteger(clean[field], field, errors, { allowNull: field !== 'Id_Prd' });
    }

    if (clean.Nombre_Prd !== undefined) {
      clean.Nombre_Prd = String(clean.Nombre_Prd).trim();
      if (clean.Nombre_Prd === '') {
        errors.push('Nombre_Prd cannot be empty');
      }
    }

    clean.Precio_Unitario = normalizeDecimal(clean.Precio_Unitario, 'Precio_Unitario', errors);
    clean.Cantidad = normalizePositiveInteger(clean.Cantidad, 'Cantidad', errors, { min: 1 });
    clean.Precio_Total = normalizeDecimal(clean.Precio_Total, 'Precio_Total', errors);
    clean.Descuento_Item = normalizeDecimal(clean.Descuento_Item, 'Descuento_Item', errors, { allowNull: false });
    clean.Fec_Ini_Licencia = normalizeDateTime(clean.Fec_Ini_Licencia, 'Fec_Ini_Licencia', errors);
    clean.Fec_Fin_Licencia = normalizeDateTime(clean.Fec_Fin_Licencia, 'Fec_Fin_Licencia', errors);

    if (clean.Cantidad === undefined) clean.Cantidad = 1;
    if (clean.Descuento_Item === undefined) clean.Descuento_Item = 0;

    if (clean.Correo_Asociado !== undefined && clean.Correo_Asociado !== null) {
      const emailResult = z.string().email().safeParse(clean.Correo_Asociado);
      if (!emailResult.success) {
        errors.push('Correo_Asociado must be a valid email');
      }
    }

    if (clean.Estado_Item !== undefined && !estadosItem.includes(clean.Estado_Item)) {
      errors.push('Estado_Item must be pendiente, entregado or cancelado');
    }

    if (clean.Precio_Unitario !== undefined && clean.Precio_Total !== undefined) {
      const cantidad = clean.Cantidad ?? 1;
      const descuento = clean.Descuento_Item ?? 0;
      const expected = Number(((clean.Precio_Unitario * cantidad) - descuento).toFixed(2));
      const received = Number(clean.Precio_Total.toFixed(2));
      if (Math.abs(expected - received) > 0.01) {
        errors.push('Precio_Total must match (Precio_Unitario * Cantidad) - Descuento_Item');
      }
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validateOrderPayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getOrderPayloadSchema(isUpdate), payload);
}

function validateOrderItemPayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getOrderItemPayloadSchema(isUpdate), payload);
}

module.exports = {
  validateOrderPayload,
  validateOrderItemPayload,
  isNumericId,
};
