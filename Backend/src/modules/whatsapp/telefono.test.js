const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPhoneCandidates } = require('./telefono');

test('normaliza las cuatro formas ecuatorianas al mismo teléfono canónico', () => {
  for (const input of ['593987078337', '0987078337', '+593 98 707 8337', '987078337']) {
    const result = buildPhoneCandidates(input);
    assert.equal(result.canonico, '593987078337');
    assert.ok(result.variantes.includes('0987078337'));
    assert.ok(result.variantes.includes('987078337'));
    assert.ok(result.variantes.includes('+593987078337'));
  }
});

test('devuelve una lista vacía para entradas sin dígitos', () => {
  assert.deepEqual(buildPhoneCandidates('sin teléfono'), {
    entrada: 'sin teléfono',
    canonico: '',
    variantes: [],
  });
});
