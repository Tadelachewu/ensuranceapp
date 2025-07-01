// Ideally, this file would be named postgres.ts or db.ts.
// Reusing it to work within system constraints.
import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL;

if (connectionString && (connectionString.match(/@/g) || []).length > 1) {
    console.warn(`
⚠️ WARNING: Your POSTGRES_URL in your .env file seems to be malformed.
It contains more than one '@' symbol. The correct format is:
postgresql://user:password@host:port/database

The application will likely fail to connect. Please correct the URL.
    `);
}


// This will use the POSTGRES_URL from your .env file
// It is recommended to use an SSL connection for production databases.
export const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString ? {
    rejectUnauthorized: false
  } : false,
});

// Add an error listener to the pool to prevent crashes on connection errors.
// This is important for handling cases where the database is temporarily unavailable.
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle pg client', err);
});
