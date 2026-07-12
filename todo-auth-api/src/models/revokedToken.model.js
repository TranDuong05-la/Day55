const { pool } = require('../config/database');

async function add(token) {
  await pool.query('INSERT INTO revoked_tokens (token) VALUES (?)', [token]);
}

async function exists(token) {
  const [rows] = await pool.query('SELECT id FROM revoked_tokens WHERE token = ?', [token]);
  return rows.length > 0;
}

module.exports = { add, exists };
