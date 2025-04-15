'use client';

// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInAnonymously, User } from 'firebase/auth';
import { getFirebaseAuth } from "@/lib/firebase/client/client-firebase";

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
  console.log("AuthProvider initialized");

    let initialCheckComplete = false;
    let timeoutId: string | number | NodeJS.Timeout | null | undefined = null;
      
    // Set persistence first
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set to browserLocalPersistence");
        // Now set up the auth state listener
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
          setUser(authUser);
          setLoading(false);
          console.log("Auth state changed:", authUser);
        }, (error) => {
          console.error("Auth state change error:", error);
          setLoading(false);
        });

        // Clean up subscription
        return () => {
          if (unsubscribe) unsubscribe();
        };
      })
      .catch((error) => {
        console.error("Setting persistence failed:", error);
        setLoading(false);
      });
  }, []);

  console.log("AuthProvider initialized 2", loading, user);

  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     // Clear any pending anonymous auth attempts
  //     if (timeoutId) {
  //       clearTimeout(timeoutId);
  //       timeoutId = null;
  //     }
      
  //     if (user) {
  //       // User is signed in
  //       setUser(user);
  //       setLoading(false);
  //       initialCheckComplete = true;
  //     } else if (!initialCheckComplete) {
  //       // First auth check returned null
  //       // Wait briefly to see if Firebase restores an existing session
  //       timeoutId = setTimeout(async () => {
  //         try {
  //           // If we're still null after the delay, try anonymous auth
  //           if (!auth.currentUser) {
  //             await signInAnonymously(auth);
  //             // Let the auth listener handle setting user state
  //           }
  //         } catch (error) {
  //           console.error("Anonymous auth failed:", error);
  //           setLoading(false);
  //         }
  //       }, 1000); // Brief grace period for auth restoration
  //     } else {
  //       // Definitive logged-out state
  //       setUser(null);
  //       setLoading(false);
  //     }
      
  //     initialCheckComplete = true;
  //   });
  
  //   return () => {
  //     unsubscribe();
  //     if (timeoutId) clearTimeout(timeoutId);
  //   };
  // }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
