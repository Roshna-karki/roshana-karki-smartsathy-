const pool = require('../config/database');

/**
 * Simplified User model for plain-text columns.
 * Assumes `name`, `email`, `password`, `company_name` are text columns.
 */

const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT uid AS id, name, email, password, company_name, created_at FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await pool.query(
    'SELECT uid AS id, name, email, company_name, created_at FROM users WHERE uid = $1',
    [id]
  );
  return result.rows[0] || null;
};

const createUser = async ({ name, email, password, companyName }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, company_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING uid AS id, name, email, company_name, created_at`,
    [name, email, password, companyName]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  findById,
  createUser,
};