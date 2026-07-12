const { pool } = require('../config/database');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
  return rows;
}

async function findOne(id) {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create(taskData) {
  const [result] = await pool.query('INSERT INTO tasks (title) VALUES (?)', [taskData.title]);
  return findOne(result.insertId);
}

async function update(id, taskData) {
  const fields = [];
  const values = [];

  if (taskData.title !== undefined) {
    fields.push('title = ?');
    values.push(taskData.title);
  }
  if (taskData.completed !== undefined) {
    fields.push('completed = ?');
    values.push(taskData.completed);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const [result] = await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
}

async function destroy(id) {
  const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { findAll, findOne, create, update, destroy };
