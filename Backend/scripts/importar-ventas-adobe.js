require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');

const DEFAULT_FILE = 'C:/Users/adri0/.codex/attachments/a6448478-df6a-4db8-aacd-051b01e14c52/pasted-text.txt';
const sourceFile = process.argv.slice(2).find((argument) => !argument.startsWith('--')) || DEFAULT_FILE;

function parseRows(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/);
  const headers = lines.shift().split('\t');

  return lines.filter(Boolean).map((line, index) => {
    const values = line.split('\t');
    const row = Object.fromEntries(headers.map((header, i) => [header, values[i] ?? '']));
    const meses = row.Meses.trim() ? Number(row.Meses.trim()) : null;

    if (!row.Correo || !row.Telefono || !row['Fecha inicio'] || !row['Fecha fin']) {
      throw new Error(`Fila ${index + 2}: faltan correo, teléfono o fechas.`);
    }

    if (meses !== null && ![1, 3, 6, 12].includes(meses)) {
      throw new Error(`Fila ${index + 2}: duración no soportada (${row.Meses}).`);
    }

    return {
      sourceLine: index + 2,
      email: row.Correo.trim().toLowerCase(),
      phone: row.Telefono.trim(),
      start: row['Fecha inicio'].trim(),
      end: row['Fecha fin'].trim(),
      months: meses,
      sourceDuration: row.Duración.trim(),
      cutoffStatus: row['Estado al corte'].trim(),
    };
  });
}

function dateTime(date) {
  return `${date} 00:00:00`;
}

function normalizeStatus(value) {
  const normalized = value.toLowerCase();
  if (normalized === 'activa') {
    return { detail: 'activo', subscription: 'activa' };
  }
  if (normalized === 'vencida') {
    return { detail: 'vencido', subscription: 'expirada' };
  }
  throw new Error(`Estado al corte no soportado: ${value}`);
}

function inferMonths(row) {
  if (row.months) return { months: row.months, inferred: false };

  const durationDays = (Date.parse(row.end) - Date.parse(row.start)) / 86400000;
  const candidates = [1, 3, 6, 12];
  const months = candidates.reduce((closest, candidate) => {
    const distance = Math.abs(durationDays - candidate * 30.5);
    return distance < closest.distance ? { candidate, distance } : closest;
  }, { candidate: 3, distance: Number.POSITIVE_INFINITY }).candidate;

  return { months, inferred: true };
}

function normalizedEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

function mapBy(rows, field, normalize = (value) => String(value ?? '').trim()) {
  return new Map(rows.filter((row) => normalize(row[field])).map((row) => [normalize(row[field]), row]));
}

async function nextSaleCode(connection, year) {
  const [result] = await connection.query(
    `
      INSERT INTO contadores_venta (Anio, Ultimo_Num) VALUES (?, LAST_INSERT_ID(1))
      ON DUPLICATE KEY UPDATE Ultimo_Num = LAST_INSERT_ID(Ultimo_Num + 1)
    `,
    [year],
  );

  return `VEN-${year}-${String(result.insertId).padStart(4, '0')}`;
}

async function createImportedClient(connection, row) {
  const [result] = await connection.query(
    `
      INSERT INTO clientes (
        Nom_Cli, Ape_Cli, Tel_Cli, Ema_Cli, Pai_Cli, Tip_Cli, Cat_Cli,
        Pre_Con_Cli, Ace_Not_What_Cli, Ace_Not_Cor_Cli, Not_Cli, Est_Cli
      ) VALUES (?, ?, ?, ?, 'Ecuador', 'persona', 'nuevo', 'whatsapp', 0, 0, ?, 'activo')
    `,
    [
      'Cliente importado',
      row.email.split('@')[0].slice(0, 100),
      row.phone,
      row.email,
      'Creado automáticamente por importación de ventas Adobe directo.',
    ],
  );
  return result.insertId;
}

async function main() {
  const rows = parseRows(sourceFile);
  const fingerprints = new Set();

  for (const row of rows) {
    const fingerprint = `${row.email}|${row.start}|${row.end}`;
    if (fingerprints.has(fingerprint)) {
      throw new Error(`La fila ${row.sourceLine} está duplicada en el archivo.`);
    }
    fingerprints.add(fingerprint);
  }

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  const report = {
    sourceFile: path.resolve(sourceFile),
    totalRows: rows.length,
    createdSales: 0,
    skippedSales: 0,
    createdClients: 0,
    clientSales: 0,
    resellerSales: 0,
    createdSubscriptions: 0,
    inferredDurations: [],
    resellerAssignments: {},
    created: [],
    skipped: [],
  };

  try {
    const [productRows] = await connection.query(
      `SELECT Id_Prd, Nom_Prd FROM productos WHERE LOWER(Nom_Prd) LIKE '%adobe%' AND Tip_Prd = 'suscripcion' ORDER BY Id_Prd LIMIT 1`,
    );
    const product = productRows[0];
    if (!product) throw new Error('No existe un producto Adobe de tipo suscripción.');

    const [variantRows] = await connection.query(
      `
        SELECT Id_Var, Dur_Val_Var, Pre_Ven_Var
        FROM variantes_productos
        WHERE Id_Prd = ? AND LOWER(Nom_Var) = 'directo' AND Est_Var = 'activo'
      `,
      [product.Id_Prd],
    );
    const variants = new Map(variantRows.map((variant) => [Number(variant.Dur_Val_Var), variant]));
    for (const months of [1, 3, 6, 12]) {
      if (!variants.has(months)) throw new Error(`Falta la variante Adobe Directo de ${months} meses.`);
    }

    const [clients] = await connection.query('SELECT * FROM clientes ORDER BY Id_Cli ASC');
    const [resellers] = await connection.query('SELECT * FROM revendedores ORDER BY Id_Rev ASC');
    const clientsByEmail = mapBy(clients, 'Ema_Cli', normalizedEmail);
    const clientsByPhone = mapBy(clients, 'Tel_Cli');
    const resellersByEmail = mapBy(resellers, 'Ema_Rev', normalizedEmail);
    const resellersByPhone = mapBy(resellers, 'Tel_Rev');

    const [existingDetails] = await connection.query(
      `SELECT Not_Dve FROM detalle_ventas WHERE Not_Dve LIKE 'IMPORT-ADOBE|%'`,
    );
    const importedFingerprints = new Set(existingDetails.map((detail) => detail.Not_Dve));

    await connection.beginTransaction();

    for (const row of rows) {
      const noteKey = `IMPORT-ADOBE|${row.email}|${row.start}|${row.end}`;
      if (importedFingerprints.has(noteKey)) {
        report.skippedSales += 1;
        report.skipped.push({ email: row.email, reason: 'ya importada' });
        continue;
      }

      const duration = inferMonths(row);
      if (duration.inferred) {
        report.inferredDurations.push({
          email: row.email,
          assignedMonths: duration.months,
          reason: 'La fila no tenía meses; se infirió por las fechas.',
        });
      }

      const variant = variants.get(duration.months);
      const status = normalizeStatus(row.cutoffStatus);
      const clientByEmail = clientsByEmail.get(row.email);
      const reseller = resellersByEmail.get(row.email) || resellersByPhone.get(row.phone);
      let client = clientByEmail;
      let saleClientId = client?.Id_Cli ?? null;
      let resellerId = null;
      let matchType = clientByEmail ? 'cliente_por_correo' : null;

      // Si el teléfono pertenece a un revendedor y el correo no identifica a
      // un cliente, la venta se registra al canal revendedor, no al cliente
      // marcador que pueda existir con ese mismo teléfono.
      if (!client && reseller) {
        resellerId = reseller.Id_Rev;
        matchType = 'revendedor_por_telefono';
      }

      if (!client && !resellerId) {
        client = clientsByPhone.get(row.phone);
        if (client) {
          saleClientId = client.Id_Cli;
          matchType = 'cliente_por_telefono';
        }
      }

      if (!client && !resellerId) {
        saleClientId = await createImportedClient(connection, row);
        client = { Id_Cli: saleClientId };
        clientsByEmail.set(row.email, client);
        clientsByPhone.set(row.phone, client);
        report.createdClients += 1;
        matchType = 'cliente_nuevo';
      }

      const saleDate = dateTime(row.start);
      const endDate = dateTime(row.end);
      const year = Number(row.start.slice(0, 4));
      const saleCode = await nextSaleCode(connection, year);
      const saleNote = [
        'Importación histórica de ventas Adobe Directo.',
        `Estado al corte: ${row.cutoffStatus}.`,
        duration.inferred ? 'Duración original no explícita; variante de 3 meses inferida por fechas.' : null,
        `Origen: línea ${row.sourceLine}.`,
      ].filter(Boolean).join(' ');

      const [saleResult] = await connection.query(
        `
          INSERT INTO ventas (
            Cod_Ven, Id_Cli, Id_Rev, Fec_Ven, Des_Tot_Ven, Imp_Tot_Ven,
            Tot_Ven, Met_Pag_Ven, Not_Ven, Est_Ven
          ) VALUES (?, ?, ?, ?, 0, 0, ?, 'Importación histórica', ?, 'completada')
        `,
        [saleCode, saleClientId, resellerId, saleDate, variant.Pre_Ven_Var, saleNote],
      );
      const saleId = saleResult.insertId;

      const [detailResult] = await connection.query(
        `
          INSERT INTO detalle_ventas (
            Id_Ven, Id_Prd, Id_Var, Cor_Cue, Can_Dve, Pre_Uni_Dve,
            Des_Uni_Dve, Fec_Ini_Dve, Fec_Fin_Dve, Not_Dve, Est_Dve
          ) VALUES (?, ?, ?, ?, 1, ?, 0, ?, ?, ?, ?)
        `,
        [saleId, product.Id_Prd, variant.Id_Var, row.email, variant.Pre_Ven_Var, saleDate, endDate, noteKey, status.detail],
      );

      let subscriptionId = null;
      if (saleClientId) {
        const [subscriptionResult] = await connection.query(
          `
            INSERT INTO suscripciones (
              Id_Cli, Id_Prd, Id_Var, Fec_Ini_Sus, Fec_Fin_Sus,
              Est_Sus, Ren_Auto, Not_Sus
            ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)
          `,
          [
            saleClientId,
            product.Id_Prd,
            variant.Id_Var,
            saleDate,
            endDate,
            status.subscription,
            'Suscripción creada automáticamente desde importación de venta Adobe Directo.',
          ],
        );
        subscriptionId = subscriptionResult.insertId;
        await connection.query('UPDATE detalle_ventas SET Id_Sus = ? WHERE Id_Dve = ?', [subscriptionId, detailResult.insertId]);
        report.createdSubscriptions += 1;
      }

      report.createdSales += 1;
      if (saleClientId) report.clientSales += 1;
      if (resellerId) {
        report.resellerSales += 1;
        report.resellerAssignments[resellerId] = (report.resellerAssignments[resellerId] || 0) + 1;
      }
      report.created.push({
        email: row.email,
        saleId,
        detailId: detailResult.insertId,
        subscriptionId,
        matchType,
        clientId: saleClientId,
        resellerId,
        variantId: variant.Id_Var,
        months: duration.months,
      });
    }

    await connection.commit();
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
