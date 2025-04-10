// lib/firebase/auth-actions.ts
// Low-level Firebase operations
import { 
    Auth, 
    User,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithRedirect
  } from 'firebase/auth';
  import { getFirebaseAuth as auth, getFirebaseAuth } from './client';
  
  export const authActions = {
    // Raw Firebase operations with minimal app logic
    async signInWithEmail(email: string, password: string) {
      return signInWithEmailAndPassword(auth(), email, password);
    },
    
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth(), provider);
    },
    
    async signOut() {
      return firebaseSignOut(auth());
    },
    
    async createServerSession(user: User) {
      const token = await user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    },
    
    async clearServerSession() {
      await fetch('/api/auth/logout', { method: 'POST' });
    }
  };
// Add these exported functions

export const signUp = async (email: string, password: string) => {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
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

export const signIn = async (email: string, password: string) => {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
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

export const signOut = async () => {
  const auth = getFirebaseAuth();
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return {
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};
// Add this exported function

export const signInWithGoogle = async (useRedirect = false) => {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();

  try {
    if (useRedirect) {
      // Better for mobile
      await signInWithRedirect(auth, provider);
      // The result will be handled elsewhere after redirect
      return { user: null, error: null };
    } else {
      // Better for desktop
      const result = await signInWithPopup(auth, provider);
      return { user: result.user, error: null };
    }
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
