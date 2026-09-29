require('dotenv').config();

const mysql = require('mysql2/promise');

const CUTOFF_DATE = '2026-08-07';
const SOURCE_ROWS = `
arterogs@gmail.com|10/10/2026|+593 99 879 8450
vdavid_cruz@hotmail.com|23/12/2026|+593 97 937 6372
carlospatricioclavijo@hotmail.com|16/09/2026|+593 99 080 0738
carandam57@gmail.com|08/08/2026|+528712406472
negrete.andres.daniel@gmail.com|07/01/2027|+593 99 516 0227
ruso_dario@hotmail.com|31/10/2026|+593 98 709 2143
davidpcob@gmail.com|22/07/2026|+593998798450
diegozambrano86@hotmail.com|01/10/2026|+593998798450
alcivarg696@gmail.com|05/12/2026|+593998798450
andreaquinde20@gmail.com|16/09/2026|+593 98 581 1723
joshuadavidcarrion@gmail.com|31/10/2026|+593997809625
fer14jc@gmail.com|05/01/2027|+593998798450
karenguerrakyc@gmail.com|04/01/2027|+593989498562
anabelrs93@gmail.com|05/08/2026|+593998798450
kevinmarti9182@gmail.com|30/06/2026|+593963917379
krear.0925@gmail.com|01/12/2026|+593997648646
nchq1296@gmail.com|28/10/2026|+593998798450
renato.merchan@gmail.com|23/12/2026|+593996563518
bryan123sebastian@gmail.com|08/05/2026|+593980775978
anializabeth.413@gmail.com|19/11/2026|+593998798450
theinfinitylovecompany@gmail.com|18/09/2026|+527441741414
wcartagena@gmail.com|31/10/2026|+50360409157
`;

function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function parseEndDate(value, lineNumber) {
  const match = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) throw new Error(`Línea ${lineNumber}: fecha inválida (${value}).`);

  const [, rawDay, rawMonth, year] = match;
  const day = rawDay.padStart(2, '0');
  const month = rawMonth.padStart(2, '0');
  const isoDate = `${year}-${month}-${day}`;
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime())
    || parsed.getUTCFullYear() !== Number(year)
    || parsed.getUTCMonth() + 1 !== Number(month)
    || parsed.getUTCDate() !== Number(day)
  ) {
    throw new Error(`Línea ${lineNumber}: fecha inválida (${value}).`);
  }

  return isoDate;
}

function subtractTwelveMonths(endDate) {
  const [year, month, day] = endDate.split('-');
  return `${Number(year) - 1}-${month}-${day}`;
}

function dateTime(date) {
  return `${date} 00:00:00`;
}

function parseRows() {
  const rows = SOURCE_ROWS.trim().split(/\r?\n/).map((line, index) => {
    const [rawEmail, rawEndDate, rawPhone] = line.split('|');
    const email = normalizeEmail(rawEmail);
    const phone = normalizePhone(rawPhone);
    const end = parseEndDate(rawEndDate, index + 1);
    const start = subtractTwelveMonths(end);

    if (!email || !email.includes('@')) throw new Error(`Línea ${index + 1}: correo inválido.`);
    if (!phone) throw new Error(`Línea ${index + 1}: teléfono inválido.`);

    return { sourceLine: index + 1, email, phone, start, end };
  });

  const fingerprints = new Set();
  for (const row of rows) {
    const fingerprint = `${row.email}|${row.start}|${row.end}`;
    if (fingerprints.has(fingerprint)) throw new Error(`Línea ${row.sourceLine}: registro duplicado.`);
    fingerprints.add(fingerprint);
  }
  return rows;
}

function mapBy(rows, field, normalize) {
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

async function createClient(connection, row) {
  const [result] = await connection.query(
    `
      INSERT INTO clientes (
        Nom_Cli, Ape_Cli, Tel_Cli, Ema_Cli, Pai_Cli, Tip_Cli, Cat_Cli,
        Pre_Con_Cli, Ace_Not_What_Cli, Ace_Not_Cor_Cli, Not_Cli, Est_Cli
      ) VALUES ('Cliente', NULL, ?, ?, 'Ecuador', 'persona', 'nuevo',
        'whatsapp', 0, 0, 'Creado por importación histórica de Canva Pro.', 'activo')
    `,
    [row.phone, row.email],
  );
  return result.insertId;
}

async function main() {
  const rows = parseRows();
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  const report = {
    cutoffDate: CUTOFF_DATE,
    totalRows: rows.length,
    createdSales: 0,
    skippedSales: 0,
    existingClientSales: 0,
    newClientSales: 0,
    resellerSales: 0,
    createdClients: 0,
    createdSubscriptions: 0,
    activeDetails: 0,
    expiredDetails: 0,
    created: [],
    skipped: [],
  };

  try {
    const [products] = await connection.query(
      `
        SELECT Id_Prd, Nom_Prd
        FROM productos
        WHERE LOWER(Nom_Prd) = 'canva' AND Tip_Prd = 'suscripcion' AND Est_Prd = 'activo'
        ORDER BY Id_Prd ASC LIMIT 1
      `,
    );
    const product = products[0];
    if (!product) throw new Error('No existe un producto Canva activo de tipo suscripción.');

    const [variants] = await connection.query(
      `
        SELECT Id_Var, Pre_Ven_Var, Pre_Rev_Var, Dur_Tip_Var, Dur_Val_Var
        FROM variantes_productos
        WHERE Id_Prd = ? AND Dur_Tip_Var = 'meses' AND Dur_Val_Var = 12 AND Est_Var = 'activo'
        ORDER BY Id_Var ASC LIMIT 1
      `,
      [product.Id_Prd],
    );
    const variant = variants[0];
    if (!variant) throw new Error('No existe una variante Canva activa de 12 meses.');

    const [clients] = await connection.query('SELECT * FROM clientes ORDER BY Id_Cli ASC');
    const [resellers] = await connection.query('SELECT * FROM revendedores ORDER BY Id_Rev ASC');
    const clientsByEmail = mapBy(clients, 'Ema_Cli', normalizeEmail);
    const clientsByPhone = mapBy(clients, 'Tel_Cli', normalizePhone);
    const resellersByEmail = mapBy(resellers, 'Ema_Rev', normalizeEmail);
    const resellersByPhone = mapBy(resellers, 'Tel_Rev', normalizePhone);
    const [existingDetails] = await connection.query(
      `SELECT Not_Dve FROM detalle_ventas WHERE Not_Dve LIKE 'IMPORT-CANVA|%'`,
    );
    const existingFingerprints = new Set(existingDetails.map((detail) => detail.Not_Dve));

    await connection.beginTransaction();
    for (const row of rows) {
      const noteKey = `IMPORT-CANVA|${row.email}|${row.start}|${row.end}`;
      if (existingFingerprints.has(noteKey)) {
        report.skippedSales += 1;
        report.skipped.push({ email: row.email, reason: 'ya importada' });
        continue;
      }

      // El teléfono del revendedor define el canal. En ese caso no se crea ni
      // se reutiliza un cliente para el correo de la cuenta Canva.
      const reseller = resellersByPhone.get(row.phone) || resellersByEmail.get(row.email);
      let client = null;
      let clientId = null;
      let resellerId = reseller?.Id_Rev ?? null;
      let matchType = resellerId ? 'revendedor_por_telefono' : null;

      if (!resellerId) {
        client = clientsByEmail.get(row.email) || clientsByPhone.get(row.phone);
        clientId = client?.Id_Cli ?? null;
        if (clientId) {
          matchType = clientsByEmail.get(row.email) ? 'cliente_por_correo' : 'cliente_por_telefono';
          report.existingClientSales += 1;
        } else {
          clientId = await createClient(connection, row);
          client = { Id_Cli: clientId, Ema_Cli: row.email, Tel_Cli: row.phone };
          clientsByEmail.set(row.email, client);
          clientsByPhone.set(row.phone, client);
          matchType = 'cliente_nuevo';
          report.createdClients += 1;
          report.newClientSales += 1;
        }
      } else {
        report.resellerSales += 1;
      }

      const expired = row.end < CUTOFF_DATE;
      const detailStatus = expired ? 'vencido' : 'activo';
      const subscriptionStatus = expired ? 'expirada' : 'activa';
      const unitPrice = resellerId
        ? Number(variant.Pre_Rev_Var ?? variant.Pre_Ven_Var)
        : Number(variant.Pre_Ven_Var);
      const saleCode = await nextSaleCode(connection, Number(row.start.slice(0, 4)));
      const saleNote = resellerId
        ? 'Importación histórica de Canva Pro 12 meses. Venta a revendedor; correo de la cuenta registrado en el detalle.'
        : 'Importación histórica de Canva Pro 12 meses.';

      const [saleResult] = await connection.query(
        `
          INSERT INTO ventas (
            Cod_Ven, Id_Cli, Id_Rev, Fec_Ven, Des_Tot_Ven, Imp_Tot_Ven,
            Tot_Ven, Met_Pag_Ven, Not_Ven, Est_Ven
          ) VALUES (?, ?, ?, ?, 0, 0, ?, 'Importación histórica', ?, 'completada')
        `,
        [saleCode, clientId, resellerId, dateTime(row.start), unitPrice, saleNote],
      );
      const [detailResult] = await connection.query(
        `
          INSERT INTO detalle_ventas (
            Id_Ven, Id_Prd, Id_Var, Cor_Cue, Can_Dve, Pre_Uni_Dve,
            Des_Uni_Dve, Fec_Ini_Dve, Fec_Fin_Dve, Not_Dve, Est_Dve
          ) VALUES (?, ?, ?, ?, 1, ?, 0, ?, ?, ?, ?)
        `,
        [
          saleResult.insertId,
          product.Id_Prd,
          variant.Id_Var,
          row.email,
          unitPrice,
          dateTime(row.start),
          dateTime(row.end),
          noteKey,
          detailStatus,
        ],
      );

      let subscriptionId = null;
      if (clientId) {
        const [subscriptionResult] = await connection.query(
          `
            INSERT INTO suscripciones (
              Id_Cli, Id_Prd, Id_Var, Fec_Ini_Sus, Fec_Fin_Sus,
              Est_Sus, Ren_Auto, Not_Sus
            ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)
          `,
          [
            clientId,
            product.Id_Prd,
            variant.Id_Var,
            dateTime(row.start),
            dateTime(row.end),
            subscriptionStatus,
            'Suscripción creada desde importación histórica de Canva Pro 12 meses.',
          ],
        );
        subscriptionId = subscriptionResult.insertId;
        await connection.query(
          'UPDATE detalle_ventas SET Id_Sus = ? WHERE Id_Dve = ?',
          [subscriptionId, detailResult.insertId],
        );
        report.createdSubscriptions += 1;
      }

      report.createdSales += 1;
      if (expired) report.expiredDetails += 1;
      else report.activeDetails += 1;
      report.created.push({
        email: row.email,
        start: row.start,
        end: row.end,
        matchType,
        clientId,
        resellerId,
        saleId: saleResult.insertId,
        detailId: detailResult.insertId,
        subscriptionId,
        status: detailStatus,
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
