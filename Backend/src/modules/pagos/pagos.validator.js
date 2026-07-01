const { z, validationResult, isNumericId, optionalTrimmedNullableString } = require('../../utils/zod');
const { pickAllowed, normalizeDecimal, normalizePositiveInteger, normalizeJsonValue } = require('../../utils/entityHelpers');
const { metodosPago, allowedFields } = require('./pagos.schemas');

function getPagoPayloadSchema(isUpdate) {
  return z.object({
    Id_Ord: z.any().optional(),
    Metodo_Pago: z.any().optional(),
    Proveedor_Pago: optionalTrimmedNullableString,
    Monto: z.any().optional(),
    Moneda: optionalTrimmedNullableString,
    Estado_Pago_Prov: optionalTrimmedNullableString,
    Id_Transaccion: optionalTrimmedNullableString,
    Stripe_PaymentIntent_Id: optionalTrimmedNullableString,
    Metadatos: z.any().optional(),
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!isNumericId(payload.Id_Ord)) {
        ctx.addIssue({ code: 'custom', path: ['Id_Ord'], message: 'Id_Ord is required and must be a positive integer' });
      }

      if (!metodosPago.includes(payload.Metodo_Pago)) {
        ctx.addIssue({ code: 'custom', path: ['Metodo_Pago'], message: 'Metodo_Pago is required and must be valid' });
      }

      if (payload.Monto === undefined || payload.Monto === null || payload.Monto === '') {
        ctx.addIssue({ code: 'custom', path: ['Monto'], message: 'Monto is required' });
      }
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, allowedFields);

    clean.Id_Ord = normalizePositiveInteger(clean.Id_Ord, 'Id_Ord', errors);
    clean.Monto = normalizeDecimal(clean.Monto, 'Monto', errors);
    clean.Metadatos = normalizeJsonValue(clean.Metadatos, 'Metadatos', errors);

    if (clean.Metodo_Pago !== undefined && !metodosPago.includes(clean.Metodo_Pago)) {
      errors.push('Metodo_Pago must be tarjeta, paypal, cripto or transferencia');
    }

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getPagoPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
