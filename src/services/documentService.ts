'use server';

import { pool } from '@/lib/firebase';

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
