'use server';

import { pool } from '@/lib/firebase';

const USER_ID = "user_123";

export interface Policy {
  id: string;
  userId: string;
  type: 'Auto' | 'Home' | 'Life' | 'Health';
  status: 'Active' | 'Pending' | 'Expired';
  premium: number;
  coverageAmount: number;
  deductible: number;
  startDate: string;
  endDate: string;
  nextDueDate?: string;
}

function dbToPolicy(dbPolicy: any): Policy {
  return {
    id: dbPolicy.id,
    userId: dbPolicy.user_id,
    type: dbPolicy.type,
    status: dbPolicy.status,
    premium: parseFloat(dbPolicy.premium),
    coverageAmount: parseFloat(dbPolicy.coverage_amount),
    deductible: parseFloat(dbPolicy.deductible),
    startDate: new Date(dbPolicy.start_date).toISOString().split('T')[0],
    endDate: new Date(dbPolicy.end_date).toISOString().split('T')[0],
    nextDueDate: dbPolicy.next_due_date ? new Date(dbPolicy.next_due_date).toISOString().split('T')[0] : undefined,
  };
}

function handleDbError(err: unknown, context: string): void {
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
  Please check the following:
  1. The hostname in your POSTGRES_URL is correct and reachable from your application.
  2. The URL format is correct: postgresql://user:password@host:port/database. The error suggests the 'host' part of your URL is incorrect.`);
    } else if (errCode === '42P01') {
      console.warn('Warning: A table was not found. Did you run `npm run db:setup`?');
    }
  }
}

export async function getPoliciesByUserId(userId: string = USER_ID): Promise<Policy[]> {
  if (!process.env.POSTGRES_URL) {
      console.warn("POSTGRES_URL is not set. Returning empty array for policies.");
      return [];
  }
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT * FROM policies WHERE user_id = $1 ORDER BY start_date DESC', [userId]);
    return res.rows.map(dbToPolicy);
  } catch (err) {
    handleDbError(err, 'getPoliciesByUserId');
    return [];
  } finally {
    client?.release();
  }
}

export async function getPolicyById(policyId: string): Promise<Policy | null> {
    if (!process.env.POSTGRES_URL) {
      console.warn("POSTGRES_URL is not set. Returning null for policy.");
      return null;
    }
    let client;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM policies WHERE id = $1', [policyId]);
      if (res.rows.length > 0) {
        return dbToPolicy(res.rows[0]);
      }
      return null;
    } catch (err) {
      handleDbError(err, 'getPolicyById');
      return null;
    } finally {
      client?.release();
    }
}
