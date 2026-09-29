const test = require('node:test');
const assert = require('node:assert/strict');
const { deriveEstadoUi, summarize } = require('./whatsapp.service');

test('deriva los estados de interfaz con el umbral configurado', () => {
  assert.equal(deriveEstadoUi({ Est_Sus: 'activa', Fec_Fin_Sus: null }, 7), 'sin_vencimiento');
  assert.equal(deriveEstadoUi({ Est_Sus: 'activa', Fec_Fin_Sus: '2026-01-01', Dias_Restantes: -1 }, 7), 'vencida');
  assert.equal(deriveEstadoUi({ Est_Sus: 'activa', Fec_Fin_Sus: '2026-01-08', Dias_Restantes: 7 }, 7), 'por_vencer');
  assert.equal(deriveEstadoUi({ Est_Sus: 'activa', Fec_Fin_Sus: '2026-01-09', Dias_Restantes: 8 }, 7), 'vigente');
  assert.equal(deriveEstadoUi({ Est_Sus: 'cancelada', Dias_Restantes: 1 }, 7), 'cancelada');
});

test('resume suscripciones sin replicar estados visuales en el cliente', () => {
  assert.deepEqual(summarize([
    { Est_Sus: 'activa', estadoUi: 'vigente' },
    { Est_Sus: 'activa', estadoUi: 'por_vencer' },
    { Est_Sus: 'expirada', estadoUi: 'expirada' },
  ]), { total: 3, activas: 2, porVencer: 1, vencidas: 1 });
});
