'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// For simplicity, we'll use a hardcoded user ID.
// In a real app, this would come from an authentication system.
const USER_ID = "user_123";

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

const defaultUser: UserProfile = {
  name: "Alex Doe",
  email: "alex@insureai.com",
  age: 35,
  location: "New York, NY",
  familySize: 2,
  occupation: "Software Engineer",
  avatar: "https://placehold.co/100x100.png"
};

export async function getUserProfile(): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', USER_ID);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as UserProfile;
  } else {
    // If the user doesn't exist, create them with default data to make the app work out-of-the-box
    await setDoc(userDocRef, defaultUser);
    return { id: USER_ID, ...defaultUser };
  }
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<void> {
    const userDocRef = doc(db, 'users', USER_ID);
    await updateDoc(userDocRef, profileData);
}
