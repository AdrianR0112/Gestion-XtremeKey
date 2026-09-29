const { z } = require('../../utils/zod');

const contextoQuerySchema = z.object({
  telefono: z.string().trim().min(7, 'El teléfono debe tener al menos 7 dígitos.').max(40),
  incluirMensaje: z.preprocess(
    (value) => value === '1' || value === 1 || value === true || value === 'true',
    z.boolean()
  ).optional().default(false),
  titularTipo: z.enum(['cliente', 'revendedor']).optional(),
  titularId: z.preprocess(
    (value) => value === undefined || value === '' ? undefined : Number(value),
    z.number().int().positive().optional()
  ),
}).passthrough().superRefine((value, ctx) => {
  if ((value.titularTipo && !value.titularId) || (!value.titularTipo && value.titularId)) {
    ctx.addIssue({ code: 'custom', message: 'titularTipo y titularId deben enviarse juntos.' });
  }
});

module.exports = { contextoQuerySchema };
