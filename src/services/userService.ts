
'use server';

import { pool } from '@/lib/firebase'; // Filename is not ideal, but it contains our PG pool now.
import { handleDbError } from '@/lib/db-errors';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  age: number;
  location: string;
  familySize: number;
  occupation: string;
  avatar: string;
}

// For this demo, a single-user ID is used across services.
const USER_ID = "user_123";

const defaultUser = {
  id: USER_ID,
  name: "Alex Doe",
  email: "alex@insureai.com",
  age: 35,
  location: "New York, NY",
  family_size: 2,
  occupation: "Software Engineer",
  avatar: "https://placehold.co/100x100.png"
};

// Helper to map database result (snake_case) to application object (camelCase)
function dbToUserProfile(dbUser: any): UserProfile {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    age: dbUser.age,
    location: dbUser.location,
    familySize: parseInt(dbUser.family_size, 10), // Map snake_case to camelCase
    occupation: dbUser.occupation,
    avatar: dbUser.avatar
  };
}

export async function getUserProfile(): Promise<UserProfile> {
  const fallbackUser = { ...defaultUser, familySize: defaultUser.family_size };
  
  if (!process.env.POSTGRES_URL) {
      console.warn("POSTGRES_URL is not set. Returning default user data.");
      return fallbackUser;
  }
  
  let client;
  try {
    client = await pool.connect();
    // Check if user exists
    let res = await client.query('SELECT * FROM users WHERE id = $1', [USER_ID]);
    
    if (res.rows.length > 0) {
      return dbToUserProfile(res.rows[0]);
    } else {
      // If not, create the user. This makes the app work out of the box.
      const insertQuery = `
        INSERT INTO users (id, name, email, age, location, family_size, occupation, avatar)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [
        defaultUser.id,
        defaultUser.name,
        defaultUser.email,
        defaultUser.age,
        defaultUser.location,
        defaultUser.family_size,
        defaultUser.occupation,
        defaultUser.avatar,
      ];
      res = await client.query(insertQuery, values);
      console.log('Created default user in PostgreSQL.');
      return dbToUserProfile(res.rows[0]);
    }
  } catch (err) {
    handleDbError(err, 'getUserProfile');
    return fallbackUser;
  } finally {
    client?.release();
  }
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<void> {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Database is not configured. POSTGRES_URL is not set.");
  }
  const { name, email, age, location, familySize, occupation, avatar } = profileData;
  let client;
  try {
    client = await pool.connect();
    const query = `
      UPDATE users
      SET name = $1, email = $2, age = $3, location = $4, family_size = $5, occupation = $6, avatar = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8;
    `;
    // Ensure all values are defined to prevent errors
    const values = [
        name || null,
        email || null,
        age || null,
        location || null,
        familySize || null,
        occupation || null,
        avatar || null,
        USER_ID
    ];
    await client.query(query, values);
  } catch (err) {
    handleDbError(err, 'updateUserProfile');
    throw new Error('Failed to update user profile. ' + (err as Error).message);
  } finally {
    client?.release();
  }
}
