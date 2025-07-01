'use server';

import { pool } from '@/lib/firebase';
import { handleDbError } from '@/lib/db-errors';

const USER_ID = "user_123";

export interface Document {
  id: number;
  userId: string;
  name: string;
  type: string;
  uploadDate: string;
  fileSizeKb: number;
  storageUrl: string;
  relatedPolicyId?: string;
  relatedClaimId?: number;
}

function dbToDocument(dbDoc: any): Document {
    return {
        id: dbDoc.id,
        userId: dbDoc.user_id,
        name: dbDoc.name,
        type: dbDoc.type,
        uploadDate: new Date(dbDoc.upload_date).toISOString().split('T')[0],
        fileSizeKb: dbDoc.file_size_kb,
        storageUrl: dbDoc.storage_url,
        relatedPolicyId: dbDoc.related_policy_id,
        relatedClaimId: dbDoc.related_claim_id,
    };
}

export async function getDocumentsByUserId(userId: string = USER_ID): Promise<Document[]> {
    if (!process.env.POSTGRES_URL) {
        console.warn("POSTGRES_URL is not set. Returning empty array for documents.");
        return [];
    }
    let client;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM documents WHERE user_id = $1 ORDER BY upload_date DESC', [userId]);
      return res.rows.map(dbToDocument);
    } catch (err) {
      handleDbError(err, 'getDocumentsByUserId');
      return [];
    } finally {
      client?.release();
    }
}
