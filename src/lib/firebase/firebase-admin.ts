// lib/firebase/firebase-admin.ts
import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

interface FirebaseAdminApp {
  getAuth: typeof getAuth;
  getFirestore: typeof getFirestore;
}

// Singleton pattern to prevent multiple initializations
export function getFirebaseAdmin(): FirebaseAdminApp {
  const apps = getApps();
  
  if (apps.length > 0) {
    // Return the existing instance
    return {
      getAuth: getAuth,
      getFirestore: getFirestore,
    };
  }

   // Make sure all required fields are present
   const requiredEnvVars = [
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_PRIVATE_KEY',
    'FIREBASE_ADMIN_CLIENT_EMAIL'
  ];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  // Initialize with service account credentials
  const serviceAccount = {
    "type": process.env.FIREBASE_ADMIN_TYPE || "service_account",
    "project_id": process.env.FIREBASE_ADMIN_PROJECT_ID || "",
    "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID || "",
    "private_key": (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "",
    "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID || "",
    "auth_uri": process.env.FIREBASE_ADMIN_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
    "token_uri": process.env.FIREBASE_ADMIN_TOKEN_URI || "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL || "",
  };

  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  return {
    getAuth: getAuth,
    getFirestore: getFirestore,
  };
}