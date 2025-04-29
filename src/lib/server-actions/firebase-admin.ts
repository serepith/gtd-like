"use server";

// lib/firebase-admin.js
import { getApps, initializeApp, cert } from 'firebase-admin/app';

export async function getFirebaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin SDK can only be used server-side');
  }
  
  const apps = getApps();
  if (!apps.length) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  
  return apps[0];
}