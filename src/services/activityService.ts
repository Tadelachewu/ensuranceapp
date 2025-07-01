'use server';

import { pool } from '@/lib/firebase';

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
    let client;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM activities WHERE user_id = $1 ORDER BY activity_date DESC LIMIT $2', [userId, limit]);
      return res.rows.map(dbToActivity);
    } catch (err) {
      console.error('Database Error:', err);
      if (err instanceof Error && 'code' in err && err.code === '42P01') {
          console.warn("`activities` table not found. Returning empty array.");
          return [];
      }
      throw new Error('Failed to fetch recent activities.');
    } finally {
      client?.release();
    }
}

export async function createActivity(activityData: Omit<Activity, 'id' | 'userId' | 'activityDate'>, userId: string = USER_ID): Promise<Activity> {
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
      console.error('Database Error:', err);
      throw new Error('Failed to create activity.');
    } finally {
      client?.release();
    }
}
