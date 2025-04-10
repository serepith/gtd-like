import { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthContextType } from '../../components/providers/firebase-auth-provider';
import { redirect, useRouter } from 'next/navigation';
import { User, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, getFirebaseAuth } from '@/lib/firebase/client';
import router from 'next/router';

// Base hook for auth state access
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context as AuthContextType;
};

// Enhanced hook that adds authentication actions
export const useAuthActions = () => {
  const { user, loading } = useAuth();
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
    loading: loading || actionLoading,
    
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

  export const useRequireAuth = (): AuthResult => {
    const { user, loading } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      // Only redirect after Firebase has initialized (loading is false)
      // AND we've confirmed there's no user
      let timeout: NodeJS.Timeout;
      
      if (!loading && !user) {
        // Small delay to avoid redirect flashes during hydration
        timeout = setTimeout(() => {
          router.push('/login');
        }, 100);
      }
      
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }, [user, loading, router]);
  
    // Return a consistent object shape regardless of auth state
    return { 
      user, 
      loading
    };
  };

  // This hook guarantees a non-null user
  export function useAuthenticatedUser(): User {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
      // This triggers Suspense
      throw new Promise<void>((resolve) => {
        // This promise intentionally never resolves
        // It just tells React "I'm not ready yet"
      });
    }
    
    if (!user) {
      throw new Error('User is not authenticated');
    }
    
    return user;
  }