const clientesRepository = require('./clientes.repository');
const { isNumericId } = require('./clientes.validator');

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || '').trim());
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

module.exports = {
  isUuid,
  findClienteByReference,
  resolveClienteInternalId,
  resolveClienteReference,
};
