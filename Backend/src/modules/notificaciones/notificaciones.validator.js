const { z, validationResult, optionalTrimmedNullableString, optionalTinyIntBoolean, isNumericId } = require('../../utils/zod');
const { pickAllowed, normalizeDateTime, normalizeJsonValue } = require('../../utils/entityHelpers');
const { tipos, allowedFields } = require('./notificaciones.schemas');

function getPayloadSchema(isUpdate) {
  return z.object({ Tipo_Not: z.any().optional(), Titulo_Not: z.any().optional(), Mensaje_Not: z.any().optional(), Datos_Not: z.any().optional(), Leida: optionalTinyIntBoolean, Fecha_Lectura: z.any().optional() }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      if (!tipos.includes(payload.Tipo_Not)) ctx.addIssue({ code: 'custom', path: ['Tipo_Not'], message: 'Tipo_Not is required and must be valid' });
      if (!payload.Titulo_Not || String(payload.Titulo_Not).trim() === '') ctx.addIssue({ code: 'custom', path: ['Titulo_Not'], message: 'Titulo_Not is required' });
      if (!payload.Mensaje_Not || String(payload.Mensaje_Not).trim() === '') ctx.addIssue({ code: 'custom', path: ['Mensaje_Not'], message: 'Mensaje_Not is required' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, allowedFields);
    if (clean.Titulo_Not !== undefined) { clean.Titulo_Not = String(clean.Titulo_Not).trim(); if (clean.Titulo_Not === '') errors.push('Titulo_Not cannot be empty'); }
    if (clean.Mensaje_Not !== undefined) { clean.Mensaje_Not = String(clean.Mensaje_Not).trim(); if (clean.Mensaje_Not === '') errors.push('Mensaje_Not cannot be empty'); }
    clean.Datos_Not = normalizeJsonValue(clean.Datos_Not, 'Datos_Not', errors);
    clean.Fecha_Lectura = normalizeDateTime(clean.Fecha_Lectura, 'Fecha_Lectura', errors);
    if (clean.Tipo_Not !== undefined && !tipos.includes(clean.Tipo_Not)) errors.push('Tipo_Not must be nuevo_pedido, pago, stock_bajo or sistema');
    if (errors.length > 0) throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) { return validationResult(getPayloadSchema(isUpdate), payload); }

module.exports = { validatePayload, isNumericId };
