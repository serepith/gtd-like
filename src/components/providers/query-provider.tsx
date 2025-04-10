// AI WROTE THIS

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useEffect, useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({/* config */}));
  
  // Only run once and only on the client
  useEffect(() => {
    // Import these dynamically to prevent server-side errors
    const setupPersistence = async () => {
      const { persistQueryClient } = await import('@tanstack/react-query-persist-client');
      const { createSyncStoragePersister } = await import('@tanstack/query-sync-storage-persister');
      
      const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
      });
      
      persistQueryClient({
        queryClient,
        persister: localStoragePersister,
      });
    };
    
    setupPersistence();
  }, [queryClient]);
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}