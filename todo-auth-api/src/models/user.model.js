const { pool } = require('../config/database');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ email, password }) {
  const [result] = await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [
    email,
    password,
  ]);
  return findById(result.insertId);
}

module.exports = { findByEmail, findById, create };
