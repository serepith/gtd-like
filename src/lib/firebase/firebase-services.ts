// AI WROTE THIS

// Import the functions you need from the SDKs
import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { Auth, 
  getRedirectResult } from "firebase/auth";
import { AppCheck } from "firebase/app-check";

import { 
} from 'firebase/auth';
import { getFirebaseAuth } from "./client";


// Add this to handle redirect results
export const handleRedirectResult = async () => {
  const auth = getFirebaseAuth();
  try {
    const result = await getRedirectResult(auth);
    return { 
      user: result ? result.user : null, 
      error: null 
    };
  } catch (error: any) {
    return { 
      user: null, 
      error: { 
        code: error.code, 
        message: error.message 
      } 
    };
  }
};


