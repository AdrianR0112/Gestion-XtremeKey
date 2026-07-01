const { drizzle } = require('drizzle-orm/mysql2');

const { getPool } = require('../../config/database');
const schema = require('./schema');

function getDrizzleDb() {
  return drizzle(getPool(), { schema, mode: 'default' });
}

module.exports = { getDrizzleDb, schema };
