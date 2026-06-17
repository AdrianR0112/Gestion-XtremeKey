const { getPool } = require('../config/database');
const { env } = require('../config/env');
const { logger } = require('../config/logger');
const { sendEmail } = require('../services/email.service');
const { buildReminderEmail, buildWhatsappUrl, toDateOnly } = require('../services/vencimientoEmail.service');
const { toEcuadorDateTime } = require('../utils/dateHelper');

function addDays(baseDate, days) {
  const [year, month, day] = baseDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + days);
  return toDateOnly(date);
}

function normalizeEmail(value) {
  const email = String(value || '').trim();
  return email || '';
}

function resolveRecipient(row, overrideEmail = '') {
  const forced = normalizeEmail(overrideEmail);
  if (forced) {
    return {
      email: forced,
      name: row.Nom_Rev_Completo || row.Nom_Cli_Completo || 'Pruebas',
      channel: 'override'
    };
  }

  if (row.Id_Rev) {
    const resellerEmail = normalizeEmail(row.Ema_Rev);
    if (!resellerEmail) return { email: '', name: row.Nom_Rev_Completo || 'Revendedor', channel: 'revendedor' };
    return {
      email: resellerEmail,
      name: row.Nom_Rev_Completo || 'Revendedor',
      channel: 'revendedor'
    };
  }

  const detailEmail = normalizeEmail(row.Cor_Cue);
  if (detailEmail) {
    return {
      email: detailEmail,
      name: row.Nom_Cli_Completo || 'Cliente',
      channel: 'detalle'
    };
  }

  const clientEmail = normalizeEmail(row.Ema_Cli);
  return {
    email: clientEmail,
    name: row.Nom_Cli_Completo || 'Cliente',
    channel: 'cliente'
  };
}

function shouldSkipByRules(row) {
  if (!row.Not_Ven_Cor_Var) {
    return 'La variante tiene desactivados los recordatorios por correo.';
  }

  if (!row.Id_Rev && !row.Ace_Not_Cor_Cli) {
    return 'El cliente no acepta notificaciones por correo.';
  }

  return '';
}

async function findCurrentConfig(pool) {
  const [rows] = await pool.query(
    'SELECT Id_Con, Nom_Emp_Con, Tel_Con, Ema_Con FROM configuracion ORDER BY Id_Con ASC LIMIT 1'
  );
  return rows[0] || null;
}

async function findEligibleDetails(pool, targetDate, type, options) {
  const clauses = ['DATE(d.Fec_Fin_Dve) = ?', "d.Est_Dve IN ('activo','vencido')"];
  const values = [targetDate];

  if (options.clientId) {
    clauses.push('v.Id_Cli = ?');
    values.push(options.clientId);
  }

  if (options.detalleId) {
    clauses.push('d.Id_Dve = ?');
    values.push(options.detalleId);
  }

  if (env.remindersTestMode && env.remindersTestClientId && !options.includeAllClients && !options.detalleId) {
    clauses.push('v.Id_Cli = ?');
    values.push(env.remindersTestClientId);
  }

  const [rows] = await pool.query(
    `
      SELECT
        d.Id_Dve,
        d.Id_Ven,
        d.Id_Prd,
        d.Id_Var,
        d.Cor_Cue,
        d.Fec_Fin_Dve,
        d.Est_Dve,
        v.Id_Cli,
        v.Id_Rev,
        c.Nom_Cli,
        c.Ape_Cli,
        CONCAT_WS(' ', c.Nom_Cli, c.Ape_Cli) AS Nom_Cli_Completo,
        c.Ema_Cli,
        c.Ace_Not_Cor_Cli,
        r.Nom_Rev,
        r.Ape_Rev,
        CONCAT_WS(' ', r.Nom_Rev, r.Ape_Rev) AS Nom_Rev_Completo,
        r.Ema_Rev,
        p.Nom_Prd,
        vr.Nom_Var,
        vr.Not_Ven_Cor_Var
      FROM detalle_ventas d
      INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
      LEFT JOIN clientes c ON c.Id_Cli = v.Id_Cli
      LEFT JOIN revendedores r ON r.Id_Rev = v.Id_Rev
      LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
      LEFT JOIN variantes_productos vr ON vr.Id_Var = d.Id_Var
      WHERE ${clauses.join(' AND ')}
      ORDER BY d.Fec_Fin_Dve ASC, d.Id_Dve ASC
    `,
    values
  );

  return rows.map((row) => ({ ...row, reminderType: type }));
}

async function findLogByUnique(pool, detalleId, reminderType, targetDate) {
  const [rows] = await pool.query(
    `SELECT * FROM recordatorios_vencimiento_email WHERE Id_Dve = ? AND Tip_Rec = ? AND Fec_Objetivo = ? LIMIT 1`,
    [detalleId, reminderType, targetDate]
  );
  return rows[0] || null;
}

async function upsertLog(pool, payload) {
  await pool.query(
    `
      INSERT INTO recordatorios_vencimiento_email (
        Id_Dve, Tip_Rec, Fec_Objetivo, Ema_Destino, Id_Cli, Id_Rev, Resend_Id, Est_Envio, Err_Envio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        Ema_Destino = VALUES(Ema_Destino),
        Id_Cli = VALUES(Id_Cli),
        Id_Rev = VALUES(Id_Rev),
        Resend_Id = VALUES(Resend_Id),
        Est_Envio = VALUES(Est_Envio),
        Err_Envio = VALUES(Err_Envio)
    `,
    [
      payload.Id_Dve,
      payload.Tip_Rec,
      payload.Fec_Objetivo,
      payload.Ema_Destino,
      payload.Id_Cli ?? null,
      payload.Id_Rev ?? null,
      payload.Resend_Id ?? null,
      payload.Est_Envio,
      payload.Err_Envio ?? null
    ]
  );
}

async function processReminder(pool, row, config, targetDate, options) {
  const existingLog = await findLogByUnique(pool, row.Id_Dve, row.reminderType, targetDate);
  if (existingLog && existingLog.Est_Envio === 'enviado' && !options.forceResend) {
    return {
      status: 'skipped',
      reason: 'El recordatorio ya fue procesado anteriormente.',
      detailId: row.Id_Dve,
      recipientEmail: existingLog.Ema_Destino
    };
  }

  const rulesSkipReason = shouldSkipByRules(row);
  if (rulesSkipReason) {
    await upsertLog(pool, {
      Id_Dve: row.Id_Dve,
      Tip_Rec: row.reminderType,
      Fec_Objetivo: targetDate,
      Ema_Destino: '',
      Id_Cli: row.Id_Cli,
      Id_Rev: row.Id_Rev,
      Est_Envio: 'omitido',
      Err_Envio: rulesSkipReason
    });

    return { status: 'skipped', reason: rulesSkipReason, detailId: row.Id_Dve, recipientEmail: '' };
  }

  const recipient = resolveRecipient(row, options.overrideEmail || env.remindersTestOverrideEmail);
  if (!recipient.email) {
    const reason = 'No se encontro un correo valido para este recordatorio.';
    await upsertLog(pool, {
      Id_Dve: row.Id_Dve,
      Tip_Rec: row.reminderType,
      Fec_Objetivo: targetDate,
      Ema_Destino: '',
      Id_Cli: row.Id_Cli,
      Id_Rev: row.Id_Rev,
      Est_Envio: 'omitido',
      Err_Envio: reason
    });

    return { status: 'skipped', reason, detailId: row.Id_Dve, recipientEmail: '' };
  }

  const expirationDate = toDateOnly(row.Fec_Fin_Dve);
  const clientName = row.Nom_Cli_Completo || row.Nom_Cli || 'Cliente';
  const whatsappUrl = buildWhatsappUrl({
    phone: config?.Tel_Con,
    clientName,
    productName: row.Nom_Prd,
    variantName: row.Nom_Var,
    expirationDate,
    reminderType: row.reminderType
  });

  const emailContent = buildReminderEmail({
    companyName: config?.Nom_Emp_Con,
    recipientName: recipient.name,
    clientName,
    productName: row.Nom_Prd,
    variantName: row.Nom_Var,
    expirationDate,
    whatsappUrl,
    reminderType: row.reminderType,
    isReseller: Boolean(row.Id_Rev)
  });

  if (options.dryRun) {
    return {
      status: 'preview',
      detailId: row.Id_Dve,
      recipientEmail: recipient.email,
      subject: emailContent.subject,
      whatsappUrl,
      reason: 'Dry run: no enviado.'
    };
  }

  const { data, error } = await sendEmail({
    to: recipient.email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
    idempotencyKey: `reminder:${row.Id_Dve}:${row.reminderType}:${targetDate}`
  });

  if (error) {
    const message = error.message || 'No se pudo enviar el correo.';
    await upsertLog(pool, {
      Id_Dve: row.Id_Dve,
      Tip_Rec: row.reminderType,
      Fec_Objetivo: targetDate,
      Ema_Destino: recipient.email,
      Id_Cli: row.Id_Cli,
      Id_Rev: row.Id_Rev,
      Resend_Id: data?.id || null,
      Est_Envio: 'error',
      Err_Envio: message
    });

    return { status: 'error', reason: message, detailId: row.Id_Dve, recipientEmail: recipient.email };
  }

  await upsertLog(pool, {
    Id_Dve: row.Id_Dve,
    Tip_Rec: row.reminderType,
    Fec_Objetivo: targetDate,
    Ema_Destino: recipient.email,
    Id_Cli: row.Id_Cli,
    Id_Rev: row.Id_Rev,
    Resend_Id: data?.id || null,
    Est_Envio: 'enviado',
    Err_Envio: null
  });

  return { status: 'sent', detailId: row.Id_Dve, recipientEmail: recipient.email, resendId: data?.id || null };
}

async function runVencimientosJob(options = {}) {
  const pool = getPool();
  const today = toDateOnly(new Date());
  const threeDaysAhead = addDays(today, 3);
  const config = await findCurrentConfig(pool);

  const datesToProcess = [];
  if (!options.type || options.type === 'pre_vencimiento') {
    datesToProcess.push({ date: threeDaysAhead, type: 'pre_vencimiento' });
  }
  if (!options.type || options.type === 'dia_vencimiento') {
    datesToProcess.push({ date: today, type: 'dia_vencimiento' });
  }

  const summary = {
    now: toEcuadorDateTime(new Date()),
    today,
    threeDaysAhead,
    dryRun: options.dryRun ?? env.remindersDryRun,
    processedCount: 0,
    sentCount: 0,
    skippedCount: 0,
    errorCount: 0,
    previewCount: 0,
    items: []
  };

  for (const entry of datesToProcess) {
    const eligibleRows = await findEligibleDetails(pool, entry.date, entry.type, options);

    for (const row of eligibleRows) {
      const result = await processReminder(pool, row, config, entry.date, {
        dryRun: options.dryRun ?? env.remindersDryRun,
        forceResend: Boolean(options.forceResend),
        overrideEmail: options.overrideEmail || '',
        includeAllClients: Boolean(options.includeAllClients)
      });

      summary.processedCount += 1;
      if (result.status === 'sent') summary.sentCount += 1;
      if (result.status === 'skipped') summary.skippedCount += 1;
      if (result.status === 'error') summary.errorCount += 1;
      if (result.status === 'preview') summary.previewCount += 1;

      summary.items.push({
        type: entry.type,
        targetDate: entry.date,
        detailId: row.Id_Dve,
        saleId: row.Id_Ven,
        clientId: row.Id_Cli,
        resellerId: row.Id_Rev,
        productName: row.Nom_Prd,
        variantName: row.Nom_Var,
        recipientEmail: result.recipientEmail,
        status: result.status,
        reason: result.reason || null,
        resendId: result.resendId || null,
        subject: result.subject || null,
        whatsappUrl: result.whatsappUrl || null
      });
    }
  }

  logger.info(
    `Recordatorios de vencimiento: ${summary.sentCount} enviados, ${summary.previewCount} previsualizados, ${summary.skippedCount} omitidos y ${summary.errorCount} con error.`
  );

  return summary;
}

module.exports = { runVencimientosJob };
