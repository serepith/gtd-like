// lib/server/firebase-auth.ts
import { cookies } from 'next/headers';
import { getFirebaseAdmin } from '../firebase/firebase-admin';
import { redirect } from 'next/navigation';
import type { DecodedIdToken } from 'firebase-admin/auth';

// This returns the user or null, for conditional logic
export async function getServerUser(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('firebase-session')?.value;
  
  
  if (!sessionCookie) {
    console.log('No session cookie found');
    return null;
  }
  
  try {
    const admin = getFirebaseAdmin();
    const decodedClaims = await admin.getAuth().verifySessionCookie(sessionCookie);
    return decodedClaims;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// This redirects if no user, for protected routes
export async function requireServerUser(): Promise<DecodedIdToken> {
  const user = await getServerUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}