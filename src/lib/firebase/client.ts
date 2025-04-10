// lib/firebase/client.ts
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { Auth, getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Create a properly memoized initialization
let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;
let firestore: Firestore | undefined;

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};


// This ensures the app is only initialized once
export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    // Check if any Firebase apps are already initialized
    if (getApps().length > 0) {
      firebaseApp = getApps()[0];
    } else {
      // Initialize a new app if none exist
      firebaseApp = initializeApp(firebaseConfig);
      
      // Only initialize App Check on the client side
      if (typeof window !== 'undefined') {
        console.log("Initializing Firebase App Check");
        // Guard against multiple initializations with a global flag
        if (!(window as any).__FIREBASE_APPCHECK_INITIALIZED__) {
            console.log(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

            initializeAppCheck(firebaseApp, {
            provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""),
            isTokenAutoRefreshEnabled: true
            });
            (window as any).__FIREBASE_APPCHECK_INITIALIZED__ = true;
        }
      }
    }
  }
  
  return firebaseApp;
}

// Memoized auth getter
// Get Auth with automatic anonymous sign-in
export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
    
    // Only run on client side
    if (typeof window !== 'undefined') {
        // Normal anonymous auth for production
        onAuthStateChanged(firebaseAuth, (user) => {
          if (!user) {
            // Auto sign-in anonymously if no user
            if(firebaseAuth) {
              signInAnonymously(firebaseAuth).catch(error => {
                console.error("Anonymous auth failed:", error);
              });
            }
          }
        });
      }
  }
  return firebaseAuth;
}

// Firestore getter
export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }
  return firestore;
}


// Create exports for direct component usage
export const app = typeof window !== 'undefined' ? getFirebaseApp() : null;
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null;
export const db = typeof window !== 'undefined' ? getFirebaseFirestore() : null;// Memoized auth getter
