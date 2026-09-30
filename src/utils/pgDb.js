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
      connectionTimeoutMillis: 3000
    });

    pool.on('error', (err) => {
      isConnected = false;
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
    isConnected = false;
    console.warn('[PostgreSQL] Pool initialization error:', err.message);
  }
}

/**
 * Execute a query with error handling and timeout
 */
export async function query(text, params = [], timeoutMs = 2500) {
  if (!pool) {
    throw new Error('PostgreSQL pool not configured');
  }
  const queryPromise = pool.query(text, params);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('PostgreSQL query timed out')), timeoutMs)
  );
  return await Promise.race([queryPromise, timeoutPromise]);
}

export { pool, isConnected };
