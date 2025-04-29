import { useContext, useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { User, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/data-firebase/init';
import { useQueryClient, useSuspenseQuery, UseSuspenseQueryResult } from '@tanstack/react-query';

// Base hook for auth state access
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   return context as AuthContextType;
// };

import { AUTH_QUERY_KEY } from '@/lib/utils/queryClient';

class UnauthenticatedError extends Error {
  constructor() {
    super('Authentication required');
    this.name = 'UnauthenticatedError';
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), setUser);
  }, []);
  
  return user;
}

/**
 * Hook that returns the current user, throwing an error if not authenticated.
 * Must be used within a Suspense boundary with an error boundary.
 */
export function useGuaranteedAuth(): User {
  const { data: user } = useSuspenseQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => Promise.resolve(null),
    staleTime: Infinity,
  });
  
  if (!user) {
    throw new UnauthenticatedError();
  }
  
  // TypeScript now knows this is a non-null User
  return user;
}

// Enhanced hook that adds authentication actions
export const useAuthActions = () => {
  const user = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Email authentication
  const signInWithEmail = async (email: string, password: string) => {
    setActionLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      await createServerSession(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };
  
  // Google authentication
  const signInWithGoogle = async () => {
    setActionLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(getFirebaseAuth(), provider);
      await createServerSession(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };
  
  // Helper for session establishment
  const createServerSession = async (user: User) => {
    const token = await user.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
  };
  
  // Sign out action
  const signOut = async () => {
    setActionLoading(true);
    try {
      await getFirebaseAuth().signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };
  
  return {
    // State from base hook
    user,
    loading: actionLoading,
    
    // Authentication actions
    signInWithEmail,
    signInWithGoogle,
    signOut,
    
    // Operation status
    error
  };
};

// Protection hook (same as before)
type AuthResult = 
  {user: User | null, loading: boolean};
//  | { user: User; loading: false }
  //| { user: null; loading: true };

  // export const useRequireAuth = (): AuthResult => {
  //   const { user, loading } = useAuth();
  //   const router = useRouter();
  
  //   useEffect(() => {
  //     // Only redirect after Firebase has initialized (loading is false)
  //     // AND we've confirmed there's no user
  //     let timeout: NodeJS.Timeout;
      
  //     if (!loading && !user) {
  //       // Small delay to avoid redirect flashes during hydration
  //       timeout = setTimeout(() => {
  //         router.push('/login');
  //       }, 100);
  //     }
      
  //     return () => {
  //       if (timeout) clearTimeout(timeout);
  //     };
  //   }, [user, loading, router]);
  
  //   // Return a consistent object shape regardless of auth state
  //   return { 
  //     user, 
  //     loading
  //   };
  // };
  
  /**
 * Hook that provides the current Firebase authentication state.
 * Uses Suspense for the initial load and real-time updates via a side effect.
 */
  export function useSuspenseAuth(): UseSuspenseQueryResult<User | null> {
    const queryClient = useQueryClient();
    
    // Set up persistent listener for real-time updates
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user: User | null) => {
        // Update cache with latest user data
        queryClient.setQueryData(['auth'], user);
      });
      
      // Clean up subscription on unmount
      return unsubscribe;
    }, [getFirebaseAuth(), queryClient]);
    
    // Initial query to get the data and enable Suspense
    return useSuspenseQuery<User | null>({
      queryKey: ['auth'],
      queryFn: () => 
        new Promise<User | null>((resolve) => {
          const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
            resolve(user);
            unsubscribe(); // We only need one resolution for the initial value
          });
        }),
      staleTime: Infinity,
    });
  }

  // This hook guarantees a non-null user
  // export function use(): User {
  
  // // Initial query to get the data and enable Suspense
  //   const user = useSuspenseQuery({
  //     queryKey: ['auth'],
  //     queryFn: () => 
  //       new Promise((resolve) => {
  //         const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
  //           resolve(user);
  //           unsubscribe(); // Clean up listener after resolution
  //         });
  //       }),
  //     staleTime: Infinity, // Auth state doesn't go stale unless explicitly invalidated
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   });
    
  //   if (loading) {
  //     // This triggers Suspense
  //     throw new Promise<void>((resolve) => {
  //       // This promise intentionally never resolves
  //       // It just tells React "I'm not ready yet"
  //     });
  //   }
    
  //   if (!user) {
  //     throw new Error('User is not authenticated');
  //   }
    
  //   return user;
  // }


  // // This hook guarantees a non-null user
  // export function use(): User {
  //   const { user, loading } = useContext(AuthContext);
     
  // // Set up persistent listener for real-time updates
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     // Update cache with latest user data
  //     queryClient.setQueryData(['auth'], user);
  //   });
    
  //   return unsubscribe; // Clean up on unmount
  // }, [auth, queryClient]);
  
  // // Initial query to get the data and enable Suspense
  //   const user = useSuspenseQuery({
  //     queryKey: ['auth'],
  //     queryFn: () => 
  //       new Promise((resolve) => {
  //         const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
  //           resolve(user);
  //           unsubscribe(); // Clean up listener after resolution
  //         });
  //       }),
  //     staleTime: Infinity, // Auth state doesn't go stale unless explicitly invalidated
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   });
    
  //   if (loading) {
  //     // This triggers Suspense
  //     throw new Promise<void>((resolve) => {
  //       // This promise intentionally never resolves
  //       // It just tells React "I'm not ready yet"
  //     });
  //   }
    
  //   if (!user) {
  //     throw new Error('User is not authenticated');
  //   }
    
  //   return user;
  // }