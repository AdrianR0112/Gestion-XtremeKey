const clientesRepository = require('./clientes.repository');
const { isNumericId } = require('./clientes.validator');

async function findClienteByReference(reference) {
  if (reference === undefined || reference === null || reference === '') {
    return null;
  }

  if (isNumericId(reference)) {
    return clientesRepository.findById(Number(reference));
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
  };
}

module.exports = {
  findClienteByReference,
  resolveClienteInternalId,
  resolveClienteReference,
};
