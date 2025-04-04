//AI WROTE THIS 
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth, db, getFirebaseApp, getFirebaseAuth, getFirebaseFirestore } from '../../lib/firebase/firebase-functions';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { TaskRepository } from '@/lib/firebase/TaskRepository';

// FirebaseProvider - Handles service initialization only
export function FirebaseProvider({ children } : { children: ReactNode }) {
  useEffect(() => {
    // Initialize Firebase services
    getFirebaseApp();
    getFirebaseAuth(); // This triggers auto sign-in but doesn't track state
    getFirebaseFirestore();
    
    // No auth state tracking here
  }, []);
  
  return children;
}