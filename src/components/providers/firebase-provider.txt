//AI WROTE THIS 
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth, db } from "@/lib/firebase/client/client-firebase";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebase/client/client-firebase";
import { getFirebaseAuth } from "@/lib/firebase/client/client-firebase";
import { onAuthStateChanged, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { TaskManager } from '@/lib/firebase/client/task-manager';

// FirebaseProvider - Handles service initialization only
export function FirebaseProvider({ children } : { children: ReactNode }) {
  useEffect(() => {
    // Initialize Firebase services
    getFirebaseApp();
    console.log("Firebase App initialized");
    getFirebaseAuth(); 
    console.log("Firebase Auth initialized");
    getFirebaseFirestore();
    console.log("Firebase Firestore initialized");
  }, []);
  
  return children;
}