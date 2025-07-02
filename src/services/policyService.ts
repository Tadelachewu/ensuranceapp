
'use server';

import { pool } from '@/lib/firebase';
import { handleDbError } from '@/lib/db-errors';
import { createActivity } from './activityService';

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

export interface PolicyData {
  policyType: string;
  coverageAmount: number;
  deductible: number;
  premium: number;
}


function dbToPolicy(dbPolicy: any): Policy {
  const policyType = dbPolicy.type.charAt(0).toUpperCase() + dbPolicy.type.slice(1);
  const validTypes: Policy['type'][] = ['Auto', 'Home', 'Life', 'Health'];

  if (!validTypes.includes(policyType)) {
    // This provides a safeguard against unexpected data from the database.
    throw new Error(`Invalid policy type "${policyType}" received from database for policy ID ${dbPolicy.id}.`);
  }
  
  return {
    id: dbPolicy.id,
    userId: dbPolicy.user_id,
    type: policyType,
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
    if (client) {
      client.release();
    }
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
      if (client) {
        client.release();
      }
    }
}

export async function createPolicy(
  policyData: Omit<Policy, 'id' | 'userId' | 'status' | 'startDate' | 'endDate' | 'nextDueDate'>,
  userId: string = USER_ID
): Promise<Policy> {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Database is not configured. POSTGRES_URL is not set.");
  }
  
  const { type, premium, coverageAmount, deductible } = policyData;
  const policyId = `POL-${type.toUpperCase()}-${Date.now()}`;
  const startDate = new Date();
  const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
  const nextDueDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

  let client;
  try {
    client = await pool.connect();
    const query = `
      INSERT INTO policies (id, user_id, type, status, premium, coverage_amount, deductible, start_date, end_date, next_due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      policyId,
      userId,
      type,
      'Active', // New policies are active
      premium,
      coverageAmount,
      deductible,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      nextDueDate.toISOString().split('T')[0]
    ];
    const res = await client.query(query, values);
    return dbToPolicy(res.rows[0]);
  } catch (err) {
    handleDbError(err, 'createPolicy');
    throw new Error(`Failed to create policy. DB Error: ${(err as Error).message}`);
  } finally {
    if (client) {
      client.release();
    }
  }
}


export async function createPolicy(policyData: PolicyData, userId: string = USER_ID): Promise<Policy> {
    if (!process.env.POSTGRES_URL) {
        throw new Error("Database is not configured. POSTGRES_URL is not set.");
    }
    const { policyType, coverageAmount, deductible, premium } = policyData;
    
    // Generate a more realistic policy ID
    const policyId = `POL${Math.floor(100000 + Math.random() * 900000)}`;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);
    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    const typeCapitalized = policyType.charAt(0).toUpperCase() + policyType.slice(1);

    let client;
    try {
        client = await pool.connect();
        const query = `
            INSERT INTO policies (id, user_id, type, status, premium, coverage_amount, deductible, start_date, end_date, next_due_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const values = [
            policyId,
            userId,
            typeCapitalized,
            'Active',
            premium,
            coverageAmount,
            deductible,
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0],
            nextDueDate.toISOString().split('T')[0]
        ];
        const res = await client.query(query, values);

        await createActivity({
          description: `New ${typeCapitalized} insurance policy purchased.`,
          iconName: 'ShieldCheck'
        });

        return dbToPolicy(res.rows[0]);
    } catch (err) {
        handleDbError(err, 'createPolicy');
        throw new Error('Failed to create policy. ' + (err as Error).message);
    } finally {
        client?.release();
    }
}
