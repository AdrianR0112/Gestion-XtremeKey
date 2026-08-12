#!/usr/bin/env node
/**
 * Recupera las lineas de venta de tipo suscripcion que nunca generaron su fila
 * en `suscripciones`.
 *
 * Por que hacen falta: las ventas a revendedor son anteriores a la funcion que
 * crea suscripciones con titular revendedor, asi que ninguna la genero. Sin la
 * suscripcion, esas ventas no aparecen en el modulo, no se renuevan de 1 clic,
 * no entran en los KPIs y no reciben recordatorios.
 *
 * Agrupa por CADENA de renovaciones (Id_Dve_Ant), no por linea: una cadena de
 * tres periodos es UNA suscripcion cuya vigencia va del inicio del primero al
 * fin del ultimo.
 *
 * Uso:
 *   node src/database/backfill_suscripciones_huerfanas.js            (simulacion)
 *   node src/database/backfill_suscripciones_huerfanas.js --apply    (escribe)
 */

const path = require('path');

process.chdir(path.resolve(__dirname, '..', '..'));

const { connectDatabase, getPool } = require('../config/database');
const { derivarEstadoSuscripcion } = require('../modules/suscripciones/suscripciones.periodo');
const { toEcuadorDateTime } = require('../utils/dateHelper');

const APLICAR = process.argv.includes('--apply');

/**
 * Lineas sin suscripcion de productos de tipo suscripcion, solo de ventas
 * completadas: una venta cancelada o pendiente no deberia crear vigencia.
 */
const SQL_HUERFANAS = `
  SELECT
    dv.Id_Dve, dv.Id_Dve_Ant, dv.Id_Ven, dv.Id_Prd, dv.Id_Var,
    dv.Cor_Cue, dv.Fec_Ini_Dve, dv.Fec_Fin_Dve,
    v.Id_Cli, v.Id_Rev, v.Cod_Ven
  FROM detalle_ventas dv
  INNER JOIN ventas v ON v.Id_Ven = dv.Id_Ven
  INNER JOIN productos p ON p.Id_Prd = dv.Id_Prd
  WHERE dv.Id_Sus IS NULL
    AND p.Tip_Prd = 'suscripcion'
    AND v.Est_Ven = 'completada'
  ORDER BY dv.Fec_Ini_Dve ASC, dv.Id_Dve ASC
`;

/**
 * Agrupa las lineas en cadenas siguiendo Id_Dve_Ant.
 *
 * Solo se encadenan lineas que esten las dos entre las huerfanas: si el
 * predecesor ya tiene suscripcion, esta linea deberia haberse enlazado a ella y
 * es un caso raro que se prefiere reportar antes que adivinar.
 */
function agruparEnCadenas(filas) {
  const porId = new Map(filas.map((fila) => [fila.Id_Dve, fila]));
  const esSucesorDeHuerfana = new Set(
    filas.filter((fila) => fila.Id_Dve_Ant && porId.has(fila.Id_Dve_Ant)).map((fila) => fila.Id_Dve)
  );

  // Las cabezas de cadena son las que no suceden a ninguna otra huerfana.
  const cabezas = filas.filter((fila) => !esSucesorDeHuerfana.has(fila.Id_Dve));

  const sucesorPorAnterior = new Map();
  for (const fila of filas) {
    if (fila.Id_Dve_Ant && porId.has(fila.Id_Dve_Ant)) {
      sucesorPorAnterior.set(fila.Id_Dve_Ant, fila);
    }
  }

  return cabezas.map((cabeza) => {
    const cadena = [cabeza];
    let guard = 0;
    let actual = cabeza;
    while (guard < 100) {
      const siguiente = sucesorPorAnterior.get(actual.Id_Dve);
      if (!siguiente) break;
      cadena.push(siguiente);
      actual = siguiente;
      guard += 1;
    }
    return cadena;
  });
}

function describirTitular(fila) {
  if (fila.Id_Rev) return `revendedor #${fila.Id_Rev}`;
  if (fila.Id_Cli) return `cliente #${fila.Id_Cli}`;
  return 'SIN TITULAR';
}

async function main() {
  await connectDatabase();
  const pool = getPool();

  const [filas] = await pool.query(SQL_HUERFANAS);
  const cadenas = agruparEnCadenas(filas);

  console.log(`\nLineas huerfanas: ${filas.length}`);
  console.log(`Cadenas a crear:  ${cadenas.length}`);
  console.log(APLICAR ? '\nMODO: APLICAR (se escribira en la BD)\n' : '\nMODO: SIMULACION (no se escribe nada). Usa --apply para aplicar.\n');

  let creadas = 0;
  const omitidas = [];
  const errores = [];

  for (const cadena of cadenas) {
    const primero = cadena[0];
    const ultimo = cadena[cadena.length - 1];

    // El XOR de titular lo respalda chk_suscripciones_titular: una linea sin
    // titular reventaria el INSERT, asi que se descarta antes.
    if (!ultimo.Id_Cli && !ultimo.Id_Rev) {
      omitidas.push({ Id_Dve: ultimo.Id_Dve, motivo: 'La venta no tiene titular (Id_Cli ni Id_Rev).' });
      continue;
    }

    const inicio = toEcuadorDateTime(primero.Fec_Ini_Dve);
    const fin = toEcuadorDateTime(ultimo.Fec_Fin_Dve);
    const estado = derivarEstadoSuscripcion(fin);
    const correo = ultimo.Cor_Cue ? String(ultimo.Cor_Cue).trim().toLowerCase() : null;

    const etiqueta =
      `${describirTitular(ultimo).padEnd(16)} ${ultimo.Cod_Ven.padEnd(15)} ` +
      `${String(correo || '(sin cuenta)').padEnd(34)} ${inicio.slice(0, 10)} -> ${fin.slice(0, 10)}  ` +
      `${estado.padEnd(9)} ${cadena.length > 1 ? `cadena de ${cadena.length} periodos` : ''}`;

    if (!APLICAR) {
      console.log(`  ${etiqueta}`);
      creadas += 1;
      continue;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [res] = await connection.query(
        `INSERT INTO suscripciones
           (Id_Cli, Id_Rev, Id_Prd, Id_Var, Cor_Cue_Sus, Fec_Ini_Sus, Fec_Fin_Sus, Est_Sus, Ren_Auto, Not_Sus)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        [
          ultimo.Id_Cli ?? null,
          ultimo.Id_Rev ?? null,
          ultimo.Id_Prd,
          ultimo.Id_Var ?? null,
          correo,
          inicio,
          fin,
          estado,
          `Recuperada desde ${ultimo.Cod_Ven}`,
        ]
      );

      // Toda la cadena apunta a la misma suscripcion. Est_Dve NO se toca: los
      // periodos ya tienen su estado correcto y cambiarlo alteraria el historial.
      const ids = cadena.map((fila) => fila.Id_Dve);
      await connection.query(
        `UPDATE detalle_ventas SET Id_Sus = ? WHERE Id_Dve IN (${ids.map(() => '?').join(', ')})`,
        [res.insertId, ...ids]
      );

      await connection.commit();
      creadas += 1;
      console.log(`  OK #${String(res.insertId).padStart(4)}  ${etiqueta}`);
    } catch (error) {
      await connection.rollback();
      errores.push({ Id_Dve: ultimo.Id_Dve, message: error.message });
      console.log(`  ERROR ${ultimo.Cod_Ven}: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  console.log(`\n${APLICAR ? 'Creadas' : 'Se crearian'}: ${creadas}`);
  if (omitidas.length) {
    console.log(`Omitidas: ${omitidas.length}`);
    for (const o of omitidas) console.log(`  Id_Dve ${o.Id_Dve}: ${o.motivo}`);
  }
  if (errores.length) {
    console.log(`Errores: ${errores.length}`);
    for (const e of errores) console.log(`  Id_Dve ${e.Id_Dve}: ${e.message}`);
  }

  await pool.end();
  process.exit(errores.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fallo el backfill:', error.message);
  process.exit(1);
});
