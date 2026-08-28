const { Pool } = require('pg');

// Reads the connection string from Render's Environment Variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for secure cloud connections
});

// Automatically sets up the database table on startup
async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL
      );
    `);
  } finally {
    client.release();
  }
}

async function addNote(text) {
  const res = await pool.query('INSERT INTO notes (text) VALUES ($1) RETURNING *', [text]);
  return res.rows[0];
}

async function getNotes() {
  const res = await pool.query('SELECT text FROM notes ORDER BY id DESC');
  return res.rows.map(row => row.text);
}

module.exports = { initDb, addNote, getNotes };
