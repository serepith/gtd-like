import { QueryClient, dehydrate } from '@tanstack/react-query';
import { getTasks } from '../../firebase/server/task-manager-setup'

export async function createDehydratedState(queryFunctions: { queryKey: any; queryFn: any; }[]) {
  const queryClient = new QueryClient();
  
  // Execute all prefetch operations
  await Promise.all(
    queryFunctions.map(({ queryKey, queryFn }) => 
      queryClient.prefetchQuery({queryKey, queryFn})
    )
  );

  return dehydrate(queryClient);
}

export async function serveTaskManagement(userId: string) {
    const queryFunctions = [
        {
        queryKey: ['tasks', userId],
        queryFn: () => getTasks(userId), 
        },
        // Add more queries as needed
    ];
    
    return createDehydratedState(queryFunctions);
}