//AI WROTE THIS

'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
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

  // Set up subscription to real-time updates
  useEffect(() => {
    if (!user?.uid) return;
    
    // This is the only place where we reference the subscription
    const unsubscribe = tasks.onTasksChanged(user.uid, (newTasks) => {
      // When Firebase pushes new data, update React Query's cache
      queryClient.setQueryData(['tasks', user?.uid], newTasks);
    });
    
    return () => unsubscribe();
  }, [user?.uid, queryClient, tasks]);

  // fetch all tasks
/*   const fetchTasks = async () => {
    if (!user?.uid) throw new Error("User not authenticated");
    return tasks.getTasks(user.uid);
  }; */

 // The query is still used for initial loading state and error handling
 const tasksQuery = useQuery({
  queryKey: ['tasks', user?.uid],
  queryFn: () => tasks.getTasks(user?.uid ?? ''),
  enabled: !!user?.uid,
  // This prevents unnecessary fetching since we're using real-time updates
  staleTime: Infinity
});

  // Add task mutation
  const addMutation = useMutation({
    mutationFn: (newTask: { content: string }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return tasks.addTask(newTask.content, user.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.uid] });
    }
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return tasks.deleteTask(taskId, user.uid);
    },
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', user?.uid] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', user?.uid]);
      
      // Optimistically update to remove the task
      queryClient.setQueryData(['tasks', user?.uid], (old = []) => 
        (old as Task[]).filter(task => task.taskId !== taskId)
      );
      
      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      console.error('Error deleting task:', err);
      // Restore the previous state if there's an error
      queryClient.setQueryData(['tasks', user?.uid], context?.previousTasks);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.uid] });
    }
  });
  
  // Update task mutation
  /* const updateMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return tasks.updateTask(taskId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.uid] });
    }
  }); */

  const updateMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return tasks.updateTask(taskId, updates);
    },
    onMutate: async ({ taskId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', user?.uid] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', user?.uid]);
      
      // Optimistically update the cache
      queryClient.setQueryData<Task[] | undefined>(['tasks', user?.uid], (old: Task[] | undefined) => 
        old?.map((task: Task) => task.taskId === taskId ? { ...task, ...updates } : task)
      );
      
      // Return a context with the previous value
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // If there's an error, roll back
      queryClient.setQueryData(['tasks', user?.uid], context?.previousTasks ?? []);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.uid] });
    }
  });

  return {
    // Query results
    tasks: tasksQuery.data,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    
    // Add functionality
    addTask: addMutation.mutate,
    isAdding: addMutation.isPending,
    
    // Update functionality
    updateTask: updateMutation.mutate,
    isUpdating: updateMutation.isPending,

    // Delete functionality
    deleteTask: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}