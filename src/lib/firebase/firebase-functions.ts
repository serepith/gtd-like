// AI WROTE THIS

// Import the functions you need from the SDKs
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth, Auth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { AppCheck, initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Create a properly memoized initialization
let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;
let firestore: Firestore | undefined;

// Your web app's Firebase configuration
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
        initializeAppCheck(firebaseApp, {
          provider: new ReCaptchaV3Provider('6LcmBwErAAAAAGD2dilaj2cQGrD0290r444YaVVr'),
          isTokenAutoRefreshEnabled: true
        });
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
      // Check if user is already signed in
      onAuthStateChanged(firebaseAuth, (user) => {
        if (!user) {
          // Auto sign-in anonymously if no user
          if (firebaseAuth) {
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

// Create non-null assertions for direct component use
// This addresses the TypeScript "possibly undefined" errors
export const app = (() => {
  if (typeof window === 'undefined') return null;
  return getFirebaseApp();
})();

export const auth = (() => {
  if (typeof window === 'undefined') return null;
  return getFirebaseAuth();
})();

export const db = (() => {
  if (typeof window === 'undefined') return null;
  return getFirebaseFirestore();
})() as Firestore; // Type assertion here is key