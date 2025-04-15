// AI WROTE THIS

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export const AUTH_QUERY_KEY = ['auth'] as const;

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [qClient] = useState(() => new QueryClient({/* config */}));
  
  // Only run once and only on the client
  useEffect(() => {
    // Import these dynamically to prevent server-side errors
    const setupPersistence = async () => {
      const { persistQueryClient } = await import('@tanstack/react-query-persist-client');
      const { createSyncStoragePersister } = await import('@tanstack/query-sync-storage-persister');
      
      const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
        key: 'TANSTACK_QUERY_CACHE', // Naming things is hard
        throttleTime: 1000, // Reduce write frequency to localStorage
        
      });
      
      persistQueryClient({
        queryClient: qClient,
        persister: localStoragePersister,
        maxAge: Infinity, // conflict resolution will handle this
      });
    };
    
    setupPersistence();

    const auth = getAuth();
    
    // Initialize the auth state in the cache
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      qClient.setQueryData(AUTH_QUERY_KEY, user);
    });
    
    return () => {
      unsubscribe();
      // Optional: Clear auth data when provider unmounts
      qClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    };
  }, [qClient]);

  
  
  return (
    <QueryClientProvider client={qClient}>
      {children}
    </QueryClientProvider>
  );
}