'use client'

// lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
// Create a queryClient that can be imported wherever needed


export const AUTH_QUERY_KEY = ['auth'] as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: false,
      networkMode: 'always',
    },
  },
});


// TanStack Query persistence
if (typeof window !== 'undefined') {
  const persist = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'TANSTACK_QUERY_CACHE',
    throttleTime: 1000,
  });


  persistQueryClient({
    queryClient,
    persister: persist
  });
}