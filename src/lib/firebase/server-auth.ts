// lib/firebase/server-auth.ts

import { cookies } from 'next/headers';
import { getFirebaseAdmin } from './firebase-admin';
import { redirect } from 'next/navigation';

// Validates session and returns decoded claims
export async function validateSessionCookie() {
  const sessionCookie = (await cookies()).get('firebase-session')?.value;
  
  if (!sessionCookie) {
    redirect('/login');
  }
  
  try {
    const { getAuth } = getFirebaseAdmin();
    // This verifies cryptographic signature and expiration
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie);
    
    // Check if user was disabled or deleted since cookie was issued
    const userRecord = await getAuth().getUser(decodedClaims.uid);
    
    if (!userRecord.emailVerified) {
      redirect('/verify-email');
    }
    
    return decodedClaims; // Contains uid, email, etc.
  } catch (error) {
    // Invalid, expired, or revoked token
    (await
          // Invalid, expired, or revoked token
          cookies()).delete('firebase-session');
    redirect('/login?error=session-expired');
  }
}

// Fetches user profile data from Firestore
export async function fetchUserProfile(uid: string) {
  const { getFirestore } = getFirebaseAdmin();
  
  try {
    const userDoc = await getFirestore()
      .collection('users')
      .doc(uid)
      .get();
    
    if (!userDoc.exists) {
      // User authenticated but no profile
      return { 
        uid,
        displayName: 'New User',
        isProfileComplete: false
      };
    }
    
    return {
      uid,
      ...userDoc.data(),
      isProfileComplete: true
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Return minimal profile rather than failing
    return { uid, displayName: 'User', isProfileComplete: false };
  }
}