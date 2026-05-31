const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  console.warn("AVISO: DATABASE_URL não está configurada no arquivo .env. O banco de dados PostgreSQL não funcionará até que seja configurado.");
  // Criar pool fictício ou nulo para evitar crashes imediatos
  pool = new Pool();
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
