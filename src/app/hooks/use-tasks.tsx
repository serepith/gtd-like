//AI WROTE THIS

'use client';

import { useQuery } from '@tanstack/react-query';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-functions';
import { TaskRepository } from '@/lib/firebase/TaskRepository';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/firebase-auth-provider';
import { useEffect } from 'react';
import { useRepositories } from '../providers/repository-provider';
import { Task } from '@/lib/models/Task';

export function useTasks() {
    const { user } = useAuth();
    const { tasks } = useRepositories();
    const queryClient = useQueryClient();
  
    // Initial fetch with proper function reference
    const result = useQuery({
      queryKey: ['tasks', user?.uid],
      queryFn: async () => {
        if (!user?.uid) throw new Error("User not authenticated");
        return tasks.getTasks(user.uid);
      },
      enabled: !!user,
    });
    
    // Real-time updates using the repository's onTasksChanged method
    useEffect(() => {
      if (!user?.uid) return;
      
      // Use the repository's real-time listener instead of direct Firestore code
      const unsubscribe = tasks.onTasksChanged(user.uid, (updatedTasks) => {
        // Update cache with real-time data
        queryClient.setQueryData(['tasks', user.uid], updatedTasks);
      });
      
      return () => unsubscribe();
    }, [user, queryClient, tasks]);
    
    return result;
  }