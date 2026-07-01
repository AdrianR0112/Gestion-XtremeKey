const { estados, createAllowedFields, updateAllowedFields } = require('./staff.schemas');
const { z, validationResult } = require('../../utils/zod');

function pickAllowed(payload = {}, allowed = []) {
  const clean = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
}

const createPayloadSchema = z.object({
  Nom_Staff: z.string().trim().min(1, 'Nom_Staff is required'),
  Ape_Staff: z.string().trim().min(1, 'Ape_Staff is required'),
  Ema_Staff: z.string().trim().email('Ema_Staff must be a valid email').transform((value) => value.toLowerCase()),
  Pas_Staff: z.string().min(6, 'Pas_Staff must have at least 6 characters'),
  Tel_Staff: z.string().trim().optional(),
  Est_Staff: z.enum(estados).optional(),
}).passthrough().transform((payload) => pickAllowed(payload, createAllowedFields));

const updatePayloadSchema = z.object({
  Nom_Staff: z.any().optional(),
  Ape_Staff: z.any().optional(),
  Ema_Staff: z.string().trim().email('Ema_Staff must be a valid email').transform((value) => value.toLowerCase()).optional(),
  Pas_Staff: z.string().min(6, 'Pas_Staff must have at least 6 characters').optional(),
  Tel_Staff: z.any().optional(),
  Est_Staff: z.enum(estados).optional(),
}).passthrough().transform((payload) => pickAllowed(payload, updateAllowedFields));

const estadoPayloadSchema = z.object({
  Est_Staff: z.enum(estados),
});

function validateCreatePayload(payload = {}) {
  return validationResult(createPayloadSchema, payload);
}

function validateUpdatePayload(payload = {}) {
  return validationResult(updatePayloadSchema, payload);
}

function validateEstadoPayload(payload = {}) {
  return validationResult(estadoPayloadSchema, payload);
}

module.exports = {
  createPayloadSchema,
  updatePayloadSchema,
  estadoPayloadSchema,
  validateCreatePayload,
  validateUpdatePayload,
  validateEstadoPayload,
};
