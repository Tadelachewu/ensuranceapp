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

export async function getPoliciesByUserId(userId: string = USER_ID): Promise<Policy[]> {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT * FROM policies WHERE user_id = $1 ORDER BY start_date DESC', [userId]);
    return res.rows.map(dbToPolicy);
  } catch (err) {
    console.error('Database Error:', err);
    if (err instanceof Error && 'code' in err && err.code === '42P01') {
        console.warn("`policies` table not found. Returning empty array.");
        return [];
    }
    throw new Error('Failed to fetch policies.');
  } finally {
    client?.release();
  }
}

export async function getPolicyById(policyId: string): Promise<Policy | null> {
    let client;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM policies WHERE id = $1', [policyId]);
      if (res.rows.length > 0) {
        return dbToPolicy(res.rows[0]);
      }
      return null;
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch policy.');
    } finally {
      client?.release();
    }
}
