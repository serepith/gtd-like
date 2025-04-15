import { AuthContextType } from "@/components/providers/firebase-auth-provider";
import { getFirebaseAuth } from "@/lib/firebase/client/client-firebase";
import { getFirebaseAdmin } from "@/lib/firebase/server/server-firebase";
import { useQueryClient, useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";
import { DecodedIdToken } from "firebase-admin/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { useEffect } from "react";

// This returns the user or null, for conditional logic
export async function serveAuth(): Promise<DecodedIdToken | null> {
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


  
  
//   export async function serveAuth(uid: string) {
//     const { getFirestore } = getFirebaseAdmin();
  
//     try {
//       const userDoc = await getFirestore()
//         .collection('users')
//         .doc(uid)
//         .get();
  
//       if (!userDoc.exists) {
//         // User authenticated but no profile
//         return {
//           uid,
//           displayName: 'New User',
//           isProfileComplete: false
//         };
//       }
  
//       return {
//         uid,
//         ...userDoc.data(),
//         isProfileComplete: true
//       };
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       // Return minimal profile rather than failing
//       return { uid, displayName: 'User', isProfileComplete: false };
//     }
//   }