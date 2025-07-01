// src/lib/db-errors.ts
'use server';

export function handleDbError(err: unknown, context: string): void {
  console.error(`Database Error in ${context}:`, err);
  if (err instanceof Error) {
    const errCode = (err as any).code;
    if (errCode === 'ECONNREFUSED') {
      console.error(`
❌ DB connection refused. This is likely an environment issue.
Please check the following:
1. Your POSTGRES_URL in the .env file is correct and does not have typos. The format is: postgresql://user:password@host:port/database
2. The database server is running and accessible from your application.
3. There are no firewalls blocking the connection to your database port.`);
    } else if (errCode === 'ENOTFOUND') {
        console.error(`
  ❌ DB hostname not found. This is a DNS or connection string issue.
  The error suggests the 'host' part of your POSTGRES_URL is incorrect or misspelled.
  Please check the following:
  1. The hostname in your POSTGRES_URL is correct and reachable from your application.
  2. The URL format is correct: postgresql://user:password@host:port/database. `);
    } else if (errCode === '42P01') {
      console.warn('Warning: A table was not found. Did you run `npm run db:setup`?');
    }
  }
}
