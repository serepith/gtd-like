// lib/firebase.ts
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore as getFirebaseFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };


let _app : FirebaseApp;
export const getFirebaseApp = () => {
  if(!_app) {
    _app = initializeApp(firebaseConfig);

    return _app;
  }
  else {
    return _app;
  }
}

let _firestore : Firestore;
export const getFirestore = () => {
  if(!_firestore) {
    //use indexedDB!
    _firestore = initializeFirestore(getFirebaseApp(), 
    {localCache: persistentLocalCache(/*settings*/{tabManager: persistentMultipleTabManager()})});
    return _firestore;
  }
  else {
    return _firestore;
  }
}

export const getFirebaseAuth = () => getAuth(getFirebaseApp());