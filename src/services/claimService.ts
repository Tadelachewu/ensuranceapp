'use server';

import { pool } from '@/lib/firebase';

const USER_ID = "user_123";

export interface Claim {
  id?: number;
  claimNumber: string;
  userId: string;
  policyId: string;
  type: string;
  incidentDate: string;
  description: string;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Denied';
}

function dbToClaim(dbClaim: any): Claim {
    return {
        id: dbClaim.id,
        claimNumber: dbClaim.claim_number,
        userId: dbClaim.user_id,
        policyId: dbClaim.policy_id,
        type: dbClaim.type,
        incidentDate: new Date(dbClaim.incident_date).toISOString().split('T')[0],
        description: dbClaim.description,
        status: dbClaim.status,
    };
}

export async function createClaim(claimData: Omit<Claim, 'id' | 'claimNumber' | 'userId' | 'status'>, userId: string = USER_ID): Promise<Claim> {
    const { policyId, type, incidentDate, description } = claimData;
    const claimNumber = `C-${Date.now()}`; // Simple unique claim number
    let client;
    try {
      client = await pool.connect();
      const query = `
        INSERT INTO claims (claim_number, user_id, policy_id, type, incident_date, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const values = [claimNumber, userId, policyId, type, incidentDate, description];
      const res = await client.query(query, values);
      return dbToClaim(res.rows[0]);
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to create claim.');
    } finally {
      client?.release();
    }
}

export async function getClaimsByUserId(userId: string = USER_ID): Promise<Claim[]> {
    let client;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM claims WHERE user_id = $1 ORDER BY incident_date DESC', [userId]);
      return res.rows.map(dbToClaim);
    } catch (err) {
      console.error('Database Error:', err);
      if (err instanceof Error && 'code' in err && err.code === '42P01') {
          console.warn("`claims` table not found. Returning empty array.");
          return [];
      }
      throw new Error('Failed to fetch claims.');
    } finally {
      client?.release();
    }
}
