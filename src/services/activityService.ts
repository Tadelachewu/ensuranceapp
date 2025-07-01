
'use server';

import { pool } from '@/lib/firebase';
import { handleDbError } from '@/lib/db-errors';

const USER_ID = "user_123";

export interface Activity {
  id: number;
  userId: string;
  description: string;
  iconName: string; // Storing the name of the Lucide icon
  activityDate: string;
}

function dbToActivity(dbActivity: any): Activity {
    return {
        id: dbActivity.id,
        userId: dbActivity.user_id,
        description: dbActivity.description,
        iconName: dbActivity.icon_name,
        activityDate: new Date(dbActivity.activity_date).toISOString(),
    };
}

export async function getRecentActivitiesByUserId(userId: string = USER_ID, limit: number = 5): Promise<Activity[]> {
    if (!process.env.POSTGRES_URL) {
        console.warn("POSTGRES_URL is not set. Returning empty array for activities.");
        return [];
    }
    let client;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM activities WHERE user_id = $1 ORDER BY activity_date DESC LIMIT $2', [userId, limit]);
      return res.rows.map(dbToActivity);
    } catch (err) {
      handleDbError(err, 'getRecentActivitiesByUserId');
      return [];
    } finally {
      client?.release();
    }
}

export async function createActivity(activityData: Omit<Activity, 'id' | 'userId' | 'activityDate'>, userId: string = USER_ID): Promise<Activity> {
    if (!process.env.POSTGRES_URL) {
        throw new Error("Database is not configured. POSTGRES_URL is not set.");
    }
    const { description, iconName } = activityData;
    let client;
    try {
      client = await pool.connect();
      const query = `
        INSERT INTO activities (user_id, description, icon_name)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [userId, description, iconName];
      const res = await client.query(query, values);
      return dbToActivity(res.rows[0]);
    } catch (err) {
      handleDbError(err, 'createActivity');
      throw new Error(`Failed to create activity. DB Error: ${(err as Error).message}`);
    } finally {
      client?.release();
    }
}
