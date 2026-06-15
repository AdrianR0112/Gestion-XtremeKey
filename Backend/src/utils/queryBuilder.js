function buildQuery(filters = {}) {
  return Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== '');
}

module.exports = { buildQuery };
