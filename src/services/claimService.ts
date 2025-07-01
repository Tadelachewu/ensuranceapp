
'use server';

import { pool } from '@/lib/firebase';
import { handleDbError } from '@/lib/db-errors';

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
    if (!process.env.POSTGRES_URL) {
        throw new Error("Database is not configured. POSTGRES_URL is not set.");
    }
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
      handleDbError(err, 'createClaim');
      // Throw the specific database error message for better debugging
      throw new Error(`Failed to create claim. DB Error: ${(err as Error).message}`);
    } finally {
      client?.release();
    }
}

export async function getClaimsByUserId(userId: string = USER_ID): Promise<Claim[]> {
    if (!process.env.POSTGRES_URL) {
        console.warn("POSTGRES_URL is not set. Returning empty array for claims.");
        return [];
    }
    let client;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM claims WHERE user_id = $1 ORDER BY incident_date DESC', [userId]);
      return res.rows.map(dbToClaim);
    } catch (err) {
      handleDbError(err, 'getClaimsByUserId');
      return [];
    } finally {
      client?.release();
    }
}
