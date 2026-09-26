import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let isConnected = false;

if (process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000
    });

    pool.on('error', (err) => {
      console.warn('[PostgreSQL] Unexpected client error in pool:', err.message);
    });

    // Test initial connection
    pool.connect()
      .then((client) => {
        isConnected = true;
        console.log('[PostgreSQL] Database pool initialized and connected successfully.');
        client.release();
      })
      .catch((err) => {
        isConnected = false;
        console.warn('[PostgreSQL] Could not establish initial connection, fallback enabled:', err.message);
      });
  } catch (err) {
    console.warn('[PostgreSQL] Pool initialization error:', err.message);
  }
}

/**
 * Execute a query with error handling
 */
export async function query(text, params = []) {
  if (!pool || !isConnected) {
    throw new Error('PostgreSQL pool not connected');
  }
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
  } catch (err) {
    console.error('[PostgreSQL Query Error]:', err.message);
    throw err;
  }
}

export { pool, isConnected };
