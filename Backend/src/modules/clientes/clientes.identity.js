const clientesRepository = require('./clientes.repository');
const { isNumericId } = require('./clientes.validator');

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || '').trim());
}

// Normaliza un correo para comparaciones/deduplicacion:
// minusculas + sin espacios al inicio/final. Devuelve null si queda vacio.
function normalizeCorreo(value) {
  if (value === undefined || value === null) {
    return null;
  }
  const normalized = String(value).trim().toLowerCase();
  return normalized || null;
}

function normalizeTelefono(value) {
  if (value === undefined || value === null) {
    return null;
  }
  const normalized = String(value).trim();
  return normalized || null;
}

async function findClienteByReference(reference) {
  if (reference === undefined || reference === null || reference === '') {
    return null;
  }

  if (isNumericId(reference)) {
    return clientesRepository.findById(Number(reference));
  }

  if (isUuid(reference)) {
    return clientesRepository.findByUuid(String(reference).trim());
  }

  return null;
}

async function resolveClienteInternalId(reference) {
  const cliente = await findClienteByReference(reference);
  return cliente ? Number(cliente.Id_Cli) : null;
}

async function resolveClienteReference(reference) {
  const cliente = await findClienteByReference(reference);
  if (!cliente) {
    return null;
  }

  return {
    Id_Cli: Number(cliente.Id_Cli),
    Uuid_Cli: cliente.Uuid_Cli || null,
  };
}

// Calcula que campos comerciales faltantes se pueden completar sin sobrescribir
// datos ya existentes del cliente. Solo rellena huecos (null/''), nunca reemplaza.
function buildMissingUpdates(cliente, data) {
  const updates = {};

  const correo = normalizeCorreo(data.correo ?? data.Ema_Cli);
  const nombre = data.nombre ?? data.Nom_Cli;
  const apellido = data.apellido ?? data.Ape_Cli;
  const telefono = normalizeTelefono(data.telefono ?? data.Tel_Cli);
  const documento = data.documento ?? data.Doc_Cli;

  const isEmpty = (value) => value === undefined || value === null || String(value).trim() === '';

  if (correo && isEmpty(cliente.Ema_Cli)) {
    updates.Ema_Cli = correo;
  }
  if (nombre && isEmpty(cliente.Nom_Cli)) {
    updates.Nom_Cli = String(nombre).trim();
  }
  if (apellido && isEmpty(cliente.Ape_Cli)) {
    updates.Ape_Cli = String(apellido).trim();
  }
  if (telefono && isEmpty(cliente.Tel_Cli)) {
    updates.Tel_Cli = telefono;
  }
  if (documento && isEmpty(cliente.Doc_Cli)) {
    updates.Doc_Cli = String(documento).trim();
  }

  return updates;
}

/**
 * Resuelve o crea un cliente comercial usando el correo como identificador principal.
 *
 * Flujo:
 *   1. Normaliza el correo (minusculas + trim).
 *   2. Busca un cliente existente por correo (case-insensitive).
 *   3. Si no hay correo, intenta como referencia secundaria por telefono.
 *   4. Si existe: completa datos faltantes (sin sobrescribir) y lo devuelve.
 *   5. Si no existe: crea un nuevo cliente con el origen indicado.
 *
 * Esta funcion centraliza la logica anti-duplicados y debe usarse en:
 *   - Registro del ecommerce (Better Auth).
 *   - Creacion de ventas del ecommerce.
 *   - Registro manual de ventas.
 *   - Creacion/importacion de clientes desde WhatsApp.
 *
 * @param {Object} data
 * @param {string} [data.correo]     Correo del cliente (identificador principal).
 * @param {string} [data.nombre]     Nombre.
 * @param {string} [data.apellido]   Apellido.
 * @param {string} [data.telefono]   Telefono (referencia secundaria).
 * @param {string} [data.documento]  Documento de identidad.
 * @param {'whatsapp'|'ecommerce'} [data.origen='whatsapp']  Origen del cliente si se crea.
 * @param {string} [data.authUserId] Id del usuario de Better Auth a enlazar al crear.
 * @returns {Promise<{cliente: Object, created: boolean}>}
 */
async function findOrCreateClienteByCorreo(data = {}) {
  const correo = normalizeCorreo(data.correo ?? data.Ema_Cli);
  const telefono = normalizeTelefono(data.telefono ?? data.Tel_Cli);
  const origen = ['whatsapp', 'ecommerce'].includes(data.origen) ? data.origen : 'whatsapp';

  // 1-3. Buscar cliente existente: primero por correo, luego por telefono.
  let existing = null;
  if (correo) {
    existing = await clientesRepository.findByEmail(correo);
  }
  if (!existing && telefono) {
    existing = await clientesRepository.findByPhone(telefono);
  }

  // 4. Existe -> completar datos faltantes sin sobrescribir.
  if (existing) {
    const updates = buildMissingUpdates(existing, data);
    if (Object.keys(updates).length > 0) {
      const updated = await clientesRepository.updateById(Number(existing.Id_Cli), updates);
      return { cliente: updated || existing, created: false };
    }
    return { cliente: existing, created: false };
  }

  // 5. No existe -> crear nuevo cliente comercial.
  const nombre = data.nombre ?? data.Nom_Cli;
  const apellido = data.apellido ?? data.Ape_Cli;

  const cliente = await clientesRepository.createOne({
    Nom_Cli: nombre ? String(nombre).trim() : 'Cliente',
    Ape_Cli: apellido ? String(apellido).trim() : null,
    Tel_Cli: telefono,
    Ema_Cli: correo,
    Doc_Cli: data.documento ? String(data.documento).trim() : null,
    Origen_Cli: origen,
    Auth_User_Id: data.authUserId ?? null,
    Email_Verificado: data.emailVerificado ? 1 : 0,
  });

  return { cliente, created: true };
}

module.exports = {
  isUuid,
  normalizeCorreo,
  normalizeTelefono,
  findClienteByReference,
  resolveClienteInternalId,
  resolveClienteReference,
  findOrCreateClienteByCorreo,
};
