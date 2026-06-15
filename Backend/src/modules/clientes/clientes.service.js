const ExcelJS = require('exceljs');
const { parse } = require('csv-parse/sync');
const clientesRepository = require('./clientes.repository');
const { validatePayload, isNumericId } = require('./clientes.validator');
const { allowedFields } = require('./clientes.schemas');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

function normalizeHeader(value) {
  return String(value || '').trim();
}

function normalizeRowKeyMap() {
  const map = new Map();
  for (const field of allowedFields) {
    map.set(field.toLowerCase(), field);
  }
  return map;
}

function normalizeImportedValue(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (typeof value === 'object') {
    if (value.text !== undefined) return String(value.text).trim();
    if (value.richText) return value.richText.map((part) => part.text).join('').trim();
    if (value.result !== undefined) return value.result;
  }
  return String(value).trim();
}

function mapRowToClientPayload(row) {
  const keyMap = normalizeRowKeyMap();
  const payload = {};

  for (const [rawKey, rawValue] of Object.entries(row || {})) {
    const key = normalizeHeader(rawKey).toLowerCase();
    const field = keyMap.get(key);
    if (field) {
      payload[field] = normalizeImportedValue(rawValue);
    }
  }

  return payload;
}

function hasFileExtension(fileName, extensions) {
  const lowerName = String(fileName || '').toLowerCase();
  return extensions.some((extension) => lowerName.endsWith(extension));
}

function isSupportedImportFile(file) {
  if (!file) return false;
  const fileName = file.originalname || '';
  const mimeType = String(file.mimetype || '').toLowerCase();
  const extensionOk = hasFileExtension(fileName, ['.csv', '.xlsx']);
  const mimeOk = [
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ].includes(mimeType);
  return extensionOk || mimeOk;
}

function getFileKind(file) {
  const fileName = String(file.originalname || '').toLowerCase();
  if (fileName.endsWith('.csv')) return 'csv';
  if (fileName.endsWith('.xlsx')) return 'xlsx';
  const mimeType = String(file.mimetype || '').toLowerCase();
  if (mimeType === 'text/csv' || mimeType === 'application/csv' || mimeType === 'application/vnd.ms-excel') {
    return 'csv';
  }
  return 'xlsx';
}

function normalizePhone(value) {
  return String(value || '').trim();
}

function buildDuplicateKeySet(existingClients) {
  const set = new Set();
  for (const client of existingClients) {
    const phone = normalizePhone(client.Tel_Cli);
    if (phone) {
      set.add(phone);
    }
  }
  return set;
}

async function parseCsvBuffer(buffer) {
  const text = buffer.toString('utf8');
  const rows = parse(text, {
    columns: (headers) => headers.map((header) => normalizeHeader(header)),
    skip_empty_lines: true,
    trim: true,
    bom: true
  });
  return Array.isArray(rows) ? rows : [];
}

async function parseXlsxBuffer(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const headerRow = worksheet.getRow(1);
  const headers = [];
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber] = normalizeHeader(cell.value);
  });

  const rows = [];
  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const values = row.values || [];
    const item = {};
    let hasData = false;

    for (let colNumber = 1; colNumber < headers.length; colNumber += 1) {
      const header = headers[colNumber];
      if (!header) continue;
      const value = values[colNumber];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        hasData = true;
      }
      item[header] = value;
    }

    if (hasData) {
      rows.push(item);
    }
  }

  return rows;
}

async function listClientes() {
  return clientesRepository.findAll();
}

async function getClienteById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cli invalido.');
  }

  const cliente = await clientesRepository.findById(Number(id));
  if (!cliente) {
    throw createHttpError(404, 'Cliente no encontrado.');
  }

  return cliente;
}

async function createCliente(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  try {
    return await clientesRepository.createOne(validation.payload);
  } catch (err) {
    if (err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
      throw createHttpError(409, 'Tel_Cli ya existe.');
    }
    throw err;
  }
}

async function updateCliente(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cli invalido.');
  }

  const current = await clientesRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Cliente no encontrado.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  try {
    return await clientesRepository.updateById(Number(id), validation.payload);
  } catch (err) {
    if (err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
      throw createHttpError(409, 'Tel_Cli ya existe.');
    }
    throw err;
  }
}

async function deleteCliente(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cli invalido.');
  }

  const deleted = await clientesRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Cliente no encontrado.');
  }
}

async function importClientesFromFile(file) {
  if (!file) {
    throw createHttpError(400, 'Archivo requerido.');
  }

  if (!isSupportedImportFile(file)) {
    throw createHttpError(400, 'Solo se permiten archivos CSV o XLSX.');
  }

  const rows = getFileKind(file) === 'csv'
    ? await parseCsvBuffer(file.buffer)
    : await parseXlsxBuffer(file.buffer);

  const existingClients = await clientesRepository.findAll();
  const duplicatePhones = buildDuplicateKeySet(existingClients);
  const importedPhones = new Set();
  const results = [];
  let inserted = 0;
  let duplicates = 0;
  let invalid = 0;

  for (let index = 0; index < rows.length; index += 1) {
    const rowNumber = index + 2;
    const rawRow = rows[index];
    const payload = mapRowToClientPayload(rawRow);
    const validation = validatePayload(payload);

    if (!validation.isValid) {
      invalid += 1;
      results.push({
        row: rowNumber,
        status: 'invalid',
        errors: validation.errors
      });
      continue;
    }

    const phone = normalizePhone(validation.payload.Tel_Cli);
    if (!phone) {
      invalid += 1;
      results.push({
        row: rowNumber,
        status: 'invalid',
        errors: ['Tel_Cli is required']
      });
      continue;
    }

    if (duplicatePhones.has(phone) || importedPhones.has(phone)) {
      duplicates += 1;
      results.push({
        row: rowNumber,
        status: 'duplicate',
        Tel_Cli: phone
      });
      continue;
    }

    try {
      const created = await clientesRepository.createOne(validation.payload);
      importedPhones.add(phone);
      duplicatePhones.add(phone);
      inserted += 1;
      results.push({
        row: rowNumber,
        status: 'inserted',
        Id_Cli: created.Id_Cli,
        Tel_Cli: created.Tel_Cli
      });
    } catch (err) {
      if (err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
        duplicates += 1;
        duplicatePhones.add(phone);
        results.push({
          row: rowNumber,
          status: 'duplicate',
          Tel_Cli: phone
        });
        continue;
      }

      throw err;
    }
  }

  return {
    summary: {
      totalRows: rows.length,
      inserted,
      duplicates,
      invalid
    },
    results
  };
}

module.exports = {
  listClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  importClientesFromFile
};
