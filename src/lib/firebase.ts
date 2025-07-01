// Ideally, this file would be named postgres.ts or db.ts.
// Reusing it to work within system constraints.
import { Pool } from 'pg';

// This will use the POSTGRES_URL from your .env file
// It is recommended to use an SSL connection for production databases.
export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL ? {
    rejectUnauthorized: false
  } : false,
});

// Add an error listener to the pool to prevent crashes on connection errors.
// This is important for handling cases where the database is temporarily unavailable.
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle pg client', err);
});
