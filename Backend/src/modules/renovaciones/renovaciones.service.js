const renovacionesRepository = require('./renovaciones.repository');

async function listRenovaciones() {
  return renovacionesRepository.findAll();
}

module.exports = { listRenovaciones };
