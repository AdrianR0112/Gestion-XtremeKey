const { getPool } = require('../../config/database');
const { parseJsonField } = require('../../utils/entityHelpers');

function mapRow(row) { return row ? { ...row, Datos_Not: parseJsonField(row.Datos_Not) } : null; }
async function findAll() { const [rows] = await getPool().query('SELECT * FROM notificaciones ORDER BY Id_Not DESC'); return rows.map(mapRow); }
async function findById(id) { const [rows] = await getPool().query('SELECT * FROM notificaciones WHERE Id_Not = ? LIMIT 1', [id]); return mapRow(rows[0] || null); }
async function createOne(data) { const [result] = await getPool().query('INSERT INTO notificaciones (Tipo_Not, Titulo_Not, Mensaje_Not, Datos_Not, Leida, Fecha_Lectura) VALUES (?, ?, ?, ?, ?, ?)', [data.Tipo_Not, data.Titulo_Not, data.Mensaje_Not, data.Datos_Not !== undefined && data.Datos_Not !== null ? JSON.stringify(data.Datos_Not) : null, data.Leida ?? 0, data.Fecha_Lectura ?? null]); return findById(result.insertId); }
async function updateById(id, data) { const fields = Object.keys(data); if (fields.length === 0) return findById(id); const payload = { ...data }; if (payload.Datos_Not !== undefined) payload.Datos_Not = payload.Datos_Not === null ? null : JSON.stringify(payload.Datos_Not); const updateFields = Object.keys(payload); const setClause = updateFields.map((field) => `${field} = ?`).join(', '); const values = updateFields.map((field) => payload[field]); await getPool().query(`UPDATE notificaciones SET ${setClause} WHERE Id_Not = ?`, [...values, id]); return findById(id); }
async function removeById(id) { const [result] = await getPool().query('DELETE FROM notificaciones WHERE Id_Not = ?', [id]); return result.affectedRows > 0; }

module.exports = { findAll, findById, createOne, updateById, removeById };
