const { z, validationResult } = require('../../utils/zod');

const suscripcionPushSchema = z.object({
  endpoint: z.string().url('endpoint must be a valid URL'),
  expirationTime: z.union([z.number(), z.null()]).optional(),
  keys: z.object({
    p256dh: z.string().trim().min(1, 'keys.p256dh is required'),
    auth: z.string().trim().min(1, 'keys.auth is required')
  }),
  label: z.preprocess((value) => {
    if (value === undefined || value === null || value === '') return null;
    return String(value).trim().slice(0, 100) || null;
  }, z.string().nullable().optional())
}).transform((payload) => ({
  End_Psh: payload.endpoint,
  Cla_P256_Psh: payload.keys.p256dh,
  Cla_Aut_Psh: payload.keys.auth,
  Eti_Psh: payload.label ?? null
}));

function validateSuscripcionPushPayload(body = {}) {
  return validationResult(suscripcionPushSchema, body);
}

module.exports = { validateSuscripcionPushPayload };
