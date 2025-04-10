'use client';

// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signInAnonymously, User } from 'firebase/auth';
import { getFirebaseAuth } from "@/lib/firebase/client";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    let initialCheckComplete = false;
    let timeoutId: string | number | NodeJS.Timeout | null | undefined = null;
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Clear any pending anonymous auth attempts
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      if (user) {
        // User is signed in
        setUser(user);
        setLoading(false);
        initialCheckComplete = true;
      } else if (!initialCheckComplete) {
        // First auth check returned null
        // Wait briefly to see if Firebase restores an existing session
        timeoutId = setTimeout(async () => {
          try {
            // If we're still null after the delay, try anonymous auth
            if (!auth.currentUser) {
              await signInAnonymously(auth);
              // Let the auth listener handle setting user state
            }
          } catch (error) {
            console.error("Anonymous auth failed:", error);
            setLoading(false);
          }
        }, 1000); // Brief grace period for auth restoration
      } else {
        // Definitive logged-out state
        setUser(null);
        setLoading(false);
      }
      
      initialCheckComplete = true;
    });
  
    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
