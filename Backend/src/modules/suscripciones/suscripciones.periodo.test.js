const test = require('node:test');
const assert = require('node:assert/strict');

const { addDuration } = require('../../utils/dateHelper');
const {
  calcularInicioPeriodo,
  resolverInicioPeriodoManual,
} = require('./suscripciones.periodo');

test('una renovacion anticipada empieza al vencer el periodo actual', () => {
  const periodo = calcularInicioPeriodo('2026-08-25T20:02:00-05:00', {
    ahora: '2026-08-18T10:00:00-05:00',
    graciaDias: 30,
  });

  assert.deepEqual(periodo, {
    inicio: '2026-08-25 20:02:00',
    encadenado: true,
    diasVencida: -7,
  });
  assert.equal(addDuration(periodo.inicio, 'meses', 1), '2026-09-25 20:02:00');
});

test('una fecha manual del mismo dia conserva la hora exacta del vencimiento', () => {
  const resultado = resolverInicioPeriodoManual(
    '2026-08-25T12:00:00-05:00',
    '2026-08-25T20:02:00-05:00'
  );

  assert.deepEqual(resultado, {
    inicio: '2026-08-25 20:02:00',
    anteriorAlVencimiento: false,
    ajustadoAlVencimiento: true,
  });
});

test('una fecha manual de un dia anterior se marca como solapamiento', () => {
  const resultado = resolverInicioPeriodoManual(
    '2026-08-24T12:00:00-05:00',
    '2026-08-25T20:02:00-05:00'
  );

  assert.equal(resultado.anteriorAlVencimiento, true);
  assert.equal(resultado.ajustadoAlVencimiento, false);
});

test('una fecha manual posterior se conserva para permitir un hueco explicito', () => {
  const resultado = resolverInicioPeriodoManual(
    '2026-08-27T12:00:00-05:00',
    '2026-08-25T20:02:00-05:00'
  );

  assert.deepEqual(resultado, {
    inicio: '2026-08-27 12:00:00',
    anteriorAlVencimiento: false,
    ajustadoAlVencimiento: false,
  });
});

test('una suscripcion vencida respeta el limite de gracia', () => {
  const dentroDeGracia = calcularInicioPeriodo('2026-08-20T20:02:00-05:00', {
    ahora: '2026-08-25T10:00:00-05:00',
    graciaDias: 5,
  });
  const fueraDeGracia = calcularInicioPeriodo('2026-08-19T20:02:00-05:00', {
    ahora: '2026-08-25T10:00:00-05:00',
    graciaDias: 5,
  });

  assert.equal(dentroDeGracia.inicio, '2026-08-20 20:02:00');
  assert.equal(dentroDeGracia.encadenado, true);
  assert.equal(fueraDeGracia.inicio, '2026-08-25 10:00:00');
  assert.equal(fueraDeGracia.encadenado, false);
});
